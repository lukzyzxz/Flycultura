

# Auditoria e Correção WCAG 2.1 AA

## Status atual

O site **já segue boa parte** das WCAG 2.1 AA: skip link, `<main>` com landmark, `aria-current` no Navbar, padrão combobox no autocomplete, tablist no Hero, `prefers-reduced-motion`, focus-visible global, lang dinâmico no `<html>`, contraste ajustado e botão pausar nos testimonials.

Mas uma auditoria nas páginas internas revelou **lacunas pontuais** que reprovam o nível AA. Vou corrigi-las.

## Problemas a corrigir

### 1. Botões-ícone sem `aria-label` (WCAG 4.1.2)
Botões de coração, lixeira, +/− quantidade, fechar carrinho não têm rótulo acessível — leitores de tela só falam "botão".

- `src/pages/EventPackages.tsx` → botão favoritar (Heart)
- `src/pages/PackageDetail.tsx` → botão favoritar (Heart)
- `src/pages/Cart.tsx` → botões aumentar/diminuir quantidade, remover item, limpar carrinho
- `src/pages/Auth.tsx` → toggle mostrar/ocultar senha (já tem em inglês — traduzir para PT também)

### 2. Estados toggle sem `aria-pressed` (WCAG 4.1.2)
- Botão favoritar em `EventPackages.tsx` e `PackageDetail.tsx` precisa `aria-pressed={isFavorite}`
- Filtros de categoria em `EventPackages.tsx` precisam `aria-pressed`

### 3. Select sem rótulo (WCAG 1.3.1, 3.3.2)
- `<select>` de ordenação em `EventPackages.tsx` não tem `<label>` nem `aria-label`

### 4. Carrossel horizontal sem instrução (WCAG 2.1.1)
- `RecentlyViewed.tsx` é scroll horizontal sem `aria-label` na região nem indicação para teclado. Adicionar `role="region"` + `aria-label` e garantir que cards são focáveis (Link já é, OK) + `aria-roledescription="carousel"` para contexto.

### 5. Hierarquia de headings quebrada (WCAG 1.3.1, 2.4.6)
- `RecentlyViewed`, `ForYouSection`, `DiscoverySections` usam `<h3>` sem `<h2>` antes (saltam de h1 do Hero direto para h3). Promover para `<h2>` e ajustar tamanho via classe.
- Cards usam `<h4>` dentro de seções com `<h3>` — após promover seções para `<h2>`, cards viram `<h3>`.

### 6. Imagens decorativas vs informativas (WCAG 1.1.1)
- Avatares em `Testimonials.tsx` estão como `alt=""` mas o nome do autor está logo ao lado — OK manter decorativo. ✅ já correto.
- Verificar `PackageDetail` hero image — confirmar que tem `alt` descritivo.

### 7. Link "Trocar voo" usa `<a href="#flights-section">` (WCAG 2.4.4)
- Em `PackageDetail.tsx` o anchor precisa que o destino exista com `id="flights-section"` e seja focável. Verificar e corrigir se faltar.

### 8. Toasts sem live region explícita (WCAG 4.1.3)
- O `Sonner` e `Toaster` do shadcn já trazem `role="status"`/`aria-live` por padrão. ✅ OK.

### 9. Contraste de classes utilitárias hardcoded (WCAG 1.4.3)
- `text-green-700 dark:text-green-400` em `Cart.tsx` e similares — validar contraste OK contra `bg-green-500/10`. Provavelmente passa, mas trocar por token semântico (`text-success`) se houver, ou manter — anotar como aceitável.
- `text-orange-500` em `Cart.tsx` (ícone decorativo, OK).

### 10. Modal `TripPlannerModal` (WCAG 2.1.2 Focus Trap)
- Modal é custom (não usa Radix Dialog). Verificar se tem `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus inicial e Escape. Aplicar correções se faltarem.

### 11. Página Auth — labels de senha (WCAG 1.3.1)
- Toggle de visibilidade da senha tem `aria-label` apenas em inglês. Traduzir conforme `locale`.

## Arquivos a modificar

```text
src/pages/EventPackages.tsx     - aria-label/aria-pressed nos botões, label no select, h2/h3
src/pages/PackageDetail.tsx     - aria-label/aria-pressed no favoritar, id da seção flights
src/pages/Cart.tsx              - aria-label nos botões quantidade/remover/limpar, h2/h3
src/pages/Auth.tsx              - i18n no aria-label do toggle de senha
src/components/RecentlyViewed.tsx - role="region", aria-label, h2 ao invés de h3
src/components/ForYouSection.tsx  - h2 ao invés de h3
src/components/DiscoverySections.tsx - h2 ao invés de h3
src/components/TripPlannerModal.tsx - role="dialog", aria-modal, aria-labelledby, Escape
```

## Detalhes técnicos

- Não vou alterar `index.css`, `App.tsx`, `Navbar.tsx`, `HeroSearch.tsx`, `SearchAutocomplete.tsx`, `Footer.tsx`, `Testimonials.tsx`, `PassengerStepper.tsx`, `SkipLink.tsx` — já estão conformes.
- Headings: trocar `text-xl md:text-2xl font-bold` em `<h3>` por `<h2>` mantendo classes — visual permanece idêntico.
- Botões toggle: padrão `aria-pressed={state}` + `aria-label` localizado PT/EN.
- Modal: envolver com keydown listener para `Escape` e usar `useRef` para focar primeiro input ao abrir.

## Fora de escopo
- Auditoria automatizada com axe-core (próxima etapa opcional).
- Reescrever páginas Blog, About, HelpCenter, Privacy, Terms, Profile — são majoritariamente texto estático e já conformes (h1 + main herdados).
- Mudar paleta de cores (já validada em iteração anterior).

