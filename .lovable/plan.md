
O usuário diz que mesmo no site publicado (`blue-sky-trips.lovable.app`), após clicar em Google e escolher a conta, ele é redirecionado para a home mas sem estar logado.

Os logs de auth mostram CLARAMENTE logins Google bem-sucedidos (status 200) com `actor_username: lukzynzx@gmail.com` em `2026-04-17T18:43:05Z` no domínio `blue-sky-trips.lovable.app`. Ou seja: **o backend recebe e aceita o login com sucesso**. O problema está no lado do cliente — a sessão é estabelecida no servidor mas não persiste/é detectada na aba de retorno.

## Hipóteses

1. **`redirect_uri: window.location.origin`** envia o usuário pra `/` (home), não pra `/auth`. Quando volta, o `lovable.auth` não consegue processar o callback porque o código de processamento OAuth está só no `Auth.tsx` (via `handleGoogleSignIn`). Mas o callback do Lovable Cloud é no path `/~oauth/callback` interceptado pelo proxy worker — então deveria funcionar em qualquer rota.

2. **Sessão não é detectada após retorno** — o `AuthContext` chama `supabase.auth.getSession()` e `onAuthStateChange`. Se o token vier via fragment `#` da URL após callback, o supabase-js detecta automaticamente. Mas se o callback do Lovable retorna tokens via uma forma que `setSession` precisa ser chamado manualmente (como faz o `lovable/index.ts` na linha `await supabase.auth.setSession(result.tokens)`), ENTÃO o problema é que essa linha só executa quando `signInWithOAuth` é chamado E retorna tokens diretamente — mas no fluxo normal (`result.redirected = true`), o navegador é redirecionado pro Google e VOLTA pra home, não pra `Auth.tsx`. Então `signInWithOAuth` nunca é re-chamado no retorno → tokens nunca passam por `setSession`.

   **Esse é provavelmente o root cause.** O Lovable Cloud auth, quando faz redirect flow, precisa que o callback seja processado em algum lugar. Mas como `redirect_uri: window.location.origin` aponta pra `/` (home/Index.tsx), nada lá processa o retorno OAuth.

3. **Solução**: mudar `redirect_uri` para apontar de volta pra `/auth` (onde o handler do `lovable.auth` pode processar), OU adicionar uma chamada de processamento de callback no boot da app (no `AuthContext`).

## Verificação a fazer

Preciso confirmar olhando o código do `lovable/index.ts` (já tenho — ele só chama `setSession` no retorno síncrono de `signInWithOAuth`, não tem um handler de callback automático).

Olhando a doc do Lovable Cloud OAuth: o proxy intercepta `/~oauth/callback` e processa tokens. Após processar, redireciona pro `redirect_uri`. Os tokens vêm provavelmente no hash `#access_token=...` — e o `supabase-js` com `detectSessionInUrl` (default true) deveria pegar.

Mas o `supabase/client.ts` atual NÃO seta `detectSessionInUrl: true` explicitamente — embora seja default true, se algo quebrou esse default... vou verificar isso na investigação.

## Plano de implementação

### 1. Investigar no client.ts a config do auth
Confirmar que `detectSessionInUrl` está implícito ou precisa ser explicitado. Não vou editar `client.ts` (proibido), mas se o problema for ali, preciso de outra rota.

### 2. Mudar redirect_uri para `/auth`
Em `src/pages/Auth.tsx`, alterar:
```ts
redirect_uri: window.location.origin + "/auth"
```
Assim o retorno OAuth cai na própria página `Auth.tsx`. Quando carrega, o `AuthContext` já tem `onAuthStateChange` ativo — se os tokens vierem via fragment `#`, o supabase-js detecta e dispara `SIGNED_IN`. O `Auth.tsx` precisa então redirecionar pra home quando `user` ficar disponível.

### 3. Adicionar redirect automático no Auth.tsx quando logado
```ts
useEffect(() => {
  if (user && !loading) {
    const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/";
    navigate(redirectTo, { replace: true });
  }
}, [user, loading]);
```

### 4. Adicionar log de debug temporário
Pra confirmar que `onAuthStateChange` dispara no retorno do OAuth, adicionar `console.log` no `AuthContext` (apenas dev).

## Arquivos a modificar
- `src/pages/Auth.tsx` — mudar `redirect_uri` pra `/auth` + adicionar useEffect de redirect quando user estiver presente
- (opcional) `src/contexts/AuthContext.tsx` — adicionar console.log temporário pra debug

## Diagrama

```text
ANTES (quebrado):
Click Google → redirect Google → /~oauth/callback (proxy)
  → redirect to "/" (home)
  → Index.tsx renderiza, ninguém processa callback
  → tokens podem estar em #fragment mas usuário não vê nada

DEPOIS (corrigido):
Click Google → redirect Google → /~oauth/callback (proxy)
  → redirect to "/auth"
  → Auth.tsx renderiza
  → supabase-js detecta tokens em #fragment automaticamente
  → onAuthStateChange dispara SIGNED_IN
  → useEffect detecta user, navega pra "/" (ou ?redirect=)
```
