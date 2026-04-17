

## Root cause identificado

**O `src/integrations/supabase/client.ts` NÃO seta `detectSessionInUrl`.** Por padrão do supabase-js é `true`, mas vou confirmar olhando o fluxo Lovable:

O `lovable.auth.signInWithOAuth` (em `src/integrations/lovable/index.ts`) tem dois caminhos:
1. **Redirect flow** (`result.redirected = true`) → navegador vai pro Google e VOLTA. Nesse caso, ninguém chama `setSession` no retorno.
2. **Token flow** (síncrono) → chama `supabase.auth.setSession(result.tokens)`.

Como o Google sempre usa redirect, caímos no caso 1. O Lovable proxy worker processa `/~oauth/callback` e redireciona pro `redirect_uri`. Mas os tokens NÃO vêm via fragment `#access_token=...` no formato que o supabase-js detecta automaticamente — eles vêm via cookie/storage do broker oauth.lovable.app, ou via query param customizado que SOMENTE o `lovableAuth` sabe processar.

**Conclusão**: o `lovableAuth` precisa ter chance de processar o callback DEPOIS do redirect. Mas hoje só é chamado quando o usuário clica no botão. No retorno do OAuth, ninguém invoca o handler.

## Solução

Adicionar processamento do callback OAuth no boot da app (no `AuthContext`). O `@lovable.dev/cloud-auth-js` tem um método (que vou confirmar) tipo `lovableAuth.handleCallback()` ou similar, OU precisamos detectar parâmetros `?code=...` / `#tokens` na URL e processar.

Vou:

### 1. Inspecionar o pacote `@lovable.dev/cloud-auth-js`
Ler `node_modules/@lovable.dev/cloud-auth-js` para descobrir API real (handleRedirect, getSessionFromUrl, etc).

### 2. Adicionar handler no AuthContext (após investigação)
No `useEffect` do `AuthProvider`, ANTES de `getSession`:
- Detectar se URL tem indicadores de callback OAuth (`?code=`, `#access_token`, ou flag específica do Lovable)
- Se sim, chamar o método de processamento do `lovableAuth`
- Aí sim chamar `getSession` + setup de `onAuthStateChange`

### 3. Manter `redirect_uri` em `/auth`
A página Auth.tsx fica como está (com useEffect de redirect quando user aparece). Combinado com o handler global do AuthContext, o fluxo fica:

```text
Click Google → /~oauth/callback (proxy)
  → redireciona pra /auth?code=... (ou similar)
  → AuthProvider boot: detecta callback, processa via lovableAuth
  → setSession → onAuthStateChange dispara SIGNED_IN
  → Auth.tsx useEffect detecta user → navega pra "/"
```

## Arquivos a modificar
- `src/contexts/AuthContext.tsx` — adicionar handler de callback OAuth no boot
- (possivelmente) `src/integrations/lovable/index.ts` — expor método de processamento de callback se necessário

## Próximos passos quando aprovado
1. Ler código do pacote `@lovable.dev/cloud-auth-js` pra descobrir API real de callback
2. Implementar handler conforme API descoberta
3. Adicionar `console.log` temporário pro debug confirmar o fluxo
4. Pedir pro usuário testar e enviar logs do console

