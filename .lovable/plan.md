

# Correções WCAG + Documentação PDF/DOCX para download

## Onde a documentação ficará disponível

A documentação **NÃO será publicada no site**. Será gerada como dois arquivos para você baixar diretamente:

- `FlyCultura-WCAG-2.1-AA.pdf` (formato principal, pronto para impressão/compartilhamento)
- `FlyCultura-WCAG-2.1-AA.docx` (formato editável Word)

Após eu gerar, ambos aparecerão como **anexos clicáveis aqui no chat** (cards de download). Você também pode acessá-los a qualquer momento clicando no botão **Files** (ícone de pasta) na navegação do editor Lovable — eles ficam armazenados em `/mnt/documents/` e persistem no seu projeto.

Nenhuma rota nova, nenhum link no Footer, nenhuma página `/docs` será criada no app.

## Correções de código (4 erros do checker WCAG)

| # | Erro | Arquivo | Correção |
|---|------|---------|----------|
| 1 | Botão sem nome acessível (carrinho) | `src/components/Navbar.tsx` | `aria-hidden="true"` no `<Button>` interno do Link `/cart` |
| 2 | Contraste insuficiente no NavLink ativo | `src/components/Navbar.tsx` | Trocar `bg-primary/10 text-primary` → `bg-primary text-primary-foreground` (≥ 4.5:1) |
| 3 | Hierarquia de headings | `src/components/Testimonials.tsx` | `<h4>` do nome do depoente → `<h3>` |
| 4 | Link `/auth` sem texto discernível | `src/components/Navbar.tsx` | `aria-label={t("nav.signIn")}` nos Links `/auth` (desktop + mobile) |

Verificação adicional: conferir `--primary` / `--primary-foreground` em `src/index.css` e ajustar para branco puro `0 0% 100%` se o contraste ficar abaixo de 4.5:1.

## Documentação técnica em PT-BR

**Geração:** script Node usando `docx` → `.docx`, depois LibreOffice headless → `.pdf`. QA visual página a página antes de entregar.

**Estrutura (≈ 15-20 páginas):**

1. Capa — FlyCultura · Conformidade WCAG 2.1 nível AA
2. Sumário executivo — escopo, padrão, status
3. O que é WCAG 2.1 AA — princípios POUR (Perceptível, Operável, Compreensível, Robusto)
4. Critérios cumpridos pelo site (com referência ao critério, descrição em PT-BR e arquivo de implementação):
   - 1.1.1 Conteúdo não-textual
   - 1.3.1 Informações e relações
   - 1.4.3 Contraste mínimo
   - 1.4.4 Redimensionar texto
   - 2.1.1 / 2.1.2 Teclado e armadilhas
   - 2.2.2 / 2.3.3 Pausar movimento
   - 2.4.1 Pular blocos (SkipLink)
   - 2.4.3 Ordem de foco
   - 2.4.4 Propósito do link
   - 2.4.6 Cabeçalhos e rótulos
   - 2.4.7 Foco visível
   - 3.1.1 / 3.1.2 Idioma da página
   - 3.3.1 / 3.3.2 Identificação de erros e rótulos
   - 4.1.2 Nome, função, valor
   - 4.1.3 Mensagens de status
5. Padrões ARIA APG implementados — combobox (autocomplete), tablist (Hero), dialog (modal)
6. Como cada implementação funciona — explicação curta + trecho de código
7. Resultado da auditoria — antes/depois dos 4 erros corrigidos
8. Checklist de manutenção contínua para novas features
9. Anexos — links para WCAG 2.1, ARIA APG, axe-core

**Saída final:**
- `/mnt/documents/FlyCultura-WCAG-2.1-AA.pdf`
- `/mnt/documents/FlyCultura-WCAG-2.1-AA.docx`

Ambos serão anexados na resposta como cards clicáveis para download imediato.

## Fora de escopo
- Criar página de documentação no site
- Adicionar link de download no Footer ou em qualquer rota pública
- Tradução do PDF para inglês (pode ser pedido depois)

