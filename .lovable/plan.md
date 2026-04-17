

## Diagnóstico

**O que SABEMOS pelos logs:**
- Login Google **funciona no backend**: `lukzynzx@gmail.com` autenticado às 19:04 hoje (status 200).
- Login email/senha usa `supabase.auth.signInWithPassword` direto — não tem motivo técnico pra falhar a menos que o build esteja quebrado.
- Build atual: **failed** (sem detalhes específicos no erro).

**Provável causa do build quebrado:** uma edição anterior pode ter deixado import/sintaxe inválida em algum arquivo tocado. O `AuthContext.tsx` e `Auth.tsx` em si parecem OK.

**Causa do "Google não loga"** (já investigada antes): o Lovable OAuth broker às vezes devolve tokens em forma que o `supabase-js` não detecta sozinho — daí o handler defensivo que adicionei no AuthContext.

## Decisão: Reset cirúrgico (NÃO precisa apagar banco)

**Não vou resetar o banco.** Os dados de `profiles`, `user_orders`, `user_favorites` etc. são valiosos e o trigger `handle_new_user` está OK. O usuário `lukzynzx@gmail.com` já existe no banco com sucesso.

**Vou refazer apenas a camada client-side de auth**, voltando ao padrão mais simples e robusto recomendado pela Lovable:

### Plano de implementação (modo default)

1. **Reescrever `src/contexts/AuthContext.tsx`** do zero, padrão canônico:
   - `onAuthStateChange` PRIMEIRO, `getSession` DEPOIS (evita race condition)
   - Sem nenhum await dentro do callback (evita deadlock)
   - Handler defensivo SIMPLES para tokens em query string OU fragment hash (`#access_token=...`)
   - Usa flag `mounted` pra evitar setState após unmount
   - Mantém API igual (`signIn`, `signUp`, `signOut`, `resetPassword`) para não quebrar componentes que consomem

2. **Reescrever `src/pages/Auth.tsx`** simplificado:
   - Mantém visual atual (Google button, formulário PT/EN, modes signin/signup/reset)
   - `redirect_uri: window.location.origin + "/auth"` para que callback caia aqui
   - `useEffect` que redireciona pra home (ou `?redirect=`) quando `user` aparece
   - Remove código duplicado/morto

3. **Manter `src/pages/ResetPassword.tsx`** como está (já funcional).

4. **Não tocar em**:
   - `src/integrations/supabase/client.ts` (proibido)
   - `src/integrations/lovable/index.ts` (auto-gerado)
   - `src/integrations/supabase/types.ts` (auto-gerado)
   - Banco de dados (mantém todos os usuários e dados)

5. **Verificar build** — se ainda falhar após o reset, pedir o erro detalhado.

### Fluxo esperado após o reset

```text
EMAIL/SENHA:
form submit → supabase.auth.signInWithPassword → onAuthStateChange("SIGNED_IN")
  → AuthContext.user atualiza → Auth.tsx useEffect → navigate("/")

GOOGLE:
click → lovable.auth.signInWithOAuth("google", redirect_uri:"/auth")
  → redirect Google → /~oauth/callback (proxy Lovable)
  → redireciona pra /auth (com tokens em hash OU query)
  → AuthContext detecta no boot → setSession → SIGNED_IN
  → Auth.tsx useEffect → navigate("/")
```

### Arquivos modificados
- `src/contexts/AuthContext.tsx` (reescrito)
- `src/pages/Auth.tsx` (reescrito, mesmo visual)

### Garantias
- Banco intacto, usuários existentes continuam funcionando
- API pública do `useAuth()` igual — outros componentes (`Profile`, `Navbar`, `Cart`, etc.) não quebram
- Build deve voltar a passar

