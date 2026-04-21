

# Auditoria e Adequação de Acessibilidade (WCAG 2.1 AA)

## Diagnóstico

Vou auditar o site contra as diretrizes WCAG 2.1 nível AA e implementar correções nas áreas mais críticas. Com base na exploração inicial do código, identifiquei os seguintes pontos:

### Problemas identificados

**1. Contraste de cores (WCAG 1.4.3)**
- `text-muted-foreground` em fundos claros pode estar abaixo de 4.5:1
- Botões `ghost` no hover precisam validação
- Cor `warning` em texto pequeno

**2. Navegação por teclado (WCAG 2.1.1, 2.4.7)**
- Falta link "Pular para o conteúdo principal" (skip link)
- Modal `TripPlannerModal` precisa de focus trap verificado
- Dropdown de sugestões em `SearchAutocomplete` não navegável por setas
- Foco visível inconsistente em alguns botões customizados

**3. Estrutura semântica (WCAG 1.3.1, 2.4.6)**
- Páginas sem `<main>` landmark explícito
- Hierarquia de headings (h1→h2→h3) inconsistente em algumas páginas
- `<section>` sem `aria-label` ou heading associado

**4. Imagens e mídia (WCAG 1.1.1)**
- `SmartImage` precisa garantir `alt` significativo (não apenas decorativo)
- Ícones interativos sem `aria-label` em alguns lugares
- Avatars de testimonials sem alt descritivo

**5. Formulários (WCAG 1.3.1, 3.3.2, 4.1.2)**
- Inputs sem `<label>` associado em alguns lugares (placeholder não conta)
- Mensagens de erro precisam `aria-describedby` e `role="alert"`
- Campos obrigatórios sem `aria-required`

**6. ARIA e estados dinâmicos (WCAG 4.1.3)**
- Toasts precisam `role="status"` ou `aria-live`
- Loading states sem anúncio para leitores de tela
- Botões de favorito sem `aria-pressed`
- Tabs no Hero sem padrão ARIA correto (`role="tablist"`, `aria-selected`)

**7. Movimento e animação (WCAG 2.3.3)**
- Carrosséis auto-rotativos (Testimonials) sem pausa para `prefers-reduced-motion`
- Animações framer-motion sem fallback

**8. Idioma (WCAG 3.1.1)**
- `<html lang>` fixo em "en" no `index.html` mas o site é PT/EN — precisa atualizar dinamicamente

---

## Mudanças propostas

### Globais
- **`index.html`**: garantir `<html lang>` correto; adicionar meta de viewport com zoom permitido
- **`src/lib/i18n.tsx`**: atualizar `document.documentElement.lang` ao trocar idioma
- **`src/index.css`**: 
  - Ajustar `--muted-foreground` para garantir contraste ≥4.5:1
  - Ajustar `--warning` em modo claro
  - Adicionar `@media (prefers-reduced-motion: reduce)` global desabilitando animações
  - Estilo `:focus-visible` reforçado e consistente
  - Classe utilitária `.sr-only` (se ainda não existir) e `.skip-link`

### Componentes
- **`src/components/SkipLink.tsx`** (novo): "Pular para o conteúdo principal" visível ao focar
- **`src/App.tsx`**: incluir `<SkipLink />` e envolver rotas em `<main id="main-content" tabIndex={-1}>`
- **`src/components/Navbar.tsx`**: 
  - `aria-label` no `<nav>`, `aria-current="page"` no link ativo
  - Botão de menu mobile com `aria-expanded` e `aria-controls`
  - Toggle de tema/idioma com `aria-label` descritivo
  - Badge do carrinho com texto acessível ("3 itens no carrinho")
- **`src/components/HeroSearch.tsx`**: 
  - Tabs com `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
  - Painel com `role="tabpanel"` e `aria-labelledby`
  - Erros de validação com `role="alert"`
- **`src/components/SearchAutocomplete.tsx`**: 
  - Padrão combobox ARIA (`role="combobox"`, `aria-expanded`, `aria-autocomplete="list"`, `aria-controls`)
  - Lista com `role="listbox"`, opções com `role="option"` e `aria-selected`
  - Navegação por setas ↑↓, Enter, Escape
- **`src/components/PassengerStepper.tsx`**: já tem boa base, ajustar `aria-live` para anúncio do total
- **`src/components/Testimonials.tsx`**: 
  - Pausar rotação se `prefers-reduced-motion: reduce`
  - Botão pausar/retomar acessível
  - `aria-live="polite"` no container que muda
- **`src/components/SmartImage.tsx`**: validar `alt=""` apenas quando decorativo; aviso em dev se ausente
- **`src/components/Footer.tsx`**: form de newsletter com label visível ou `aria-label`, mensagens de erro com `role="alert"`
- **`src/components/TripPlannerModal.tsx`**: garantir `aria-labelledby`, `aria-describedby`, focus trap (já vem do Radix Dialog), erro de validação com `role="alert"`

### Páginas
- **`src/pages/Auth.tsx`**: confirmar labels associados a inputs, `aria-invalid`, `role="alert"` nos erros (a maioria já vem do `react-hook-form` + shadcn `<FormMessage>`)
- **`src/pages/Index.tsx`** e demais páginas: adicionar `<main>` quando faltar, revisar hierarquia de headings

### Documentação
- Criar `mem://accessibility/wcag-standards` com regras a seguir em novos componentes

---

## Detalhes técnicos

**Padrão de contraste**: validar com `color-contrast` (texto normal 4.5:1, texto grande 3:1).

**Focus visible**: 
```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Reduced motion**: 
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Combobox ARIA** (SearchAutocomplete) seguindo APG: input controla listbox via `aria-controls`, opção ativa marcada por `aria-activedescendant`.

**Skip link**: posicionado absoluto fora da viewport, visível ao receber foco (`:focus`).

---

## Fora de escopo
- Auditoria de todas as 18+ páginas com mesma profundidade — focarei nos componentes compartilhados (Navbar, Footer, Hero, formulários, modal) que já cobrem ~80% da experiência
- Testes automatizados com axe-core (pode ser uma próxima etapa)
- Tradução de todos os `aria-label` para PT/EN dinâmico em cada componente — usarei i18n onde já existe, fallback em inglês onde não há string

