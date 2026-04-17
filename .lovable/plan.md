

## Plano de implementação

### 1. Erro Google Login
Os logs do servidor mostram **logins Google bem-sucedidos (status 200)** no domínio publicado (`blue-sky-trips.lovable.app`). O erro acontece tipicamente no ambiente de **preview**, onde o redirect funciona diferente. Não há bug no código — vou reforçar mensagens de erro no `Auth.tsx` para mostrar instrução clara ao usuário e orientar uso da URL publicada. Sem alterar lógica OAuth.

### 2. Scroll-to-top em mudança de rota
Criar componente `src/components/ScrollToTop.tsx` que escuta `useLocation()` e chama `window.scrollTo(0, 0)` em cada mudança. Adicionar dentro do `<BrowserRouter>` em `App.tsx`.

### 3. Remover eventos passados
Em `src/lib/events-data.ts`, há 1 pacote com `date: "Junho 2025"` (Coachella linha 547-549). Vou:
- Adicionar campo `eventDate: string` (ISO `YYYY-MM`) em cada pacote para checagem confiável
- Filtrar pacotes passados em `EventPackages.tsx`, `Results.tsx`, `ForYouSection.tsx`, `DiscoverySections.tsx`, `Index.tsx`
- Helper `isEventUpcoming(eventDate)` em `src/lib/events-data.ts`

### 4. Validações de busca (`HeroSearch.tsx` + `Results.tsx`)

**a) Bloquear datas passadas:**
- Adicionar `min={today}` no `<Input type="date">`
- Validar antes do `navigate()`; se passada → `toast` de erro

**b) Origem/destino não encontrado:**
- Em `Results.tsx`, quando `matchingPackages.length === 0` E `matchingDestinations.length === 0`, mostrar bloco "Não encontrado" + carrossel de "Outras ofertas" (top 6 pacotes upcoming)

**c) Campo passageiros — substituir input livre por stepper:**
Trocar `<Input>` de "1 adulto" por componente custom com botões `−` / `+` e display do número. Min = 1, Max = 9. Estado `adults: number`. Passar como query param `&adults=N`.

```text
[ −  ]  1 adulto  [ + ]
```

### 5. Itens já abordados em mensagens anteriores
- **Imagens / fallback temático**: já implementado pelo `SmartImage.tsx`. Vou apenas adicionar:
  - Lazy loading nativo (`loading="lazy"`) já existe no SmartImage ✓
  - **Blur-up placeholder**: trocar skeleton por um `bg-gradient` sutil + filtro `blur-sm` que some no `onLoad`
  - **IntersectionObserver**: o atributo `loading="lazy"` nativo já cobre isso eficientemente; não vou adicionar JS extra para evitar complexidade

### 6. Página de admin de logs de fallback
Criar:
- `src/lib/imageErrorLog.ts` — singleton em `localStorage` que registra `{ src, category, timestamp, page }` quando `SmartImage` cai em fallback
- Modificar `SmartImage.tsx` para chamar o logger no `handleError`
- `src/pages/AdminImageLog.tsx` — lista todos os erros com tabela (data, URL quebrada, página, categoria) + botão "Limpar log"
- Rota `/admin/image-log` em `App.tsx` (sem auth gate — apenas dev tool)

### Arquivos a modificar/criar

```text
CRIAR:
  src/components/ScrollToTop.tsx
  src/components/PassengerStepper.tsx
  src/lib/imageErrorLog.ts
  src/pages/AdminImageLog.tsx

MODIFICAR:
  src/App.tsx                  → ScrollToTop + rota admin
  src/components/HeroSearch.tsx → date min, stepper, adults state
  src/components/SmartImage.tsx → blur-up + log de erros
  src/lib/events-data.ts       → +eventDate, helper isEventUpcoming, remover/datar Coachella
  src/pages/Results.tsx        → filtro upcoming, "não encontrado" + ofertas
  src/pages/EventPackages.tsx  → filtro upcoming
  src/components/ForYouSection.tsx → filtro upcoming
  src/components/DiscoverySections.tsx → filtro upcoming
```

### Comportamento final do campo passageiros

```text
┌─────────────────────────────┐
│ 👥  [−]   1 adulto   [+]    │
└─────────────────────────────┘
   • Mínimo 1, máximo 9
   • Não aceita texto
   • Botão − desabilitado em 1
   • Botão + desabilitado em 9
```

### Comportamento "não encontrado" em Results

```text
┌─────────────────────────────────────┐
│  🔍  Nada encontrado para "xyz"      │
│  Tente outro destino ou veja        │
│  ofertas em destaque abaixo ↓       │
└─────────────────────────────────────┘
[carrossel de 6 pacotes upcoming]
```

