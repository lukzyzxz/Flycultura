# Validações de datas, origem padrão e inputs blindados

## Objetivo
Garantir que toda data pedida no app seja válida (entre hoje e 31/12/2050), pré-preencher a origem com o aeroporto padrão da conta (permitindo trocar), corrigir o campo de orçamento que aceita notação científica ("e") e impedir que o usuário digite valores fora da faixa nos campos numéricos — sempre exibindo mensagem de erro clara.

## Mudanças

### 1. Helper central de validação de datas — `src/lib/dateLimits.ts` (novo)
- Exporta `MIN_DATE` (hoje, formato `YYYY-MM-DD`) e `MAX_DATE` (`2050-12-31`).
- `clampDate(value)` retorna a data válida ou string vazia.
- `isValidFutureDate(value)` retorna `boolean`.
- `dateErrorMessage(locale)` retorna a mensagem padrão bilíngue ("Escolha uma data entre hoje e 31/12/2050").

### 2. `HeroSearch.tsx` (segunda imagem do usuário)
- **Origem pré-preenchida:** `useState(() => getAirportLabel(getHomeAirport()))` em `from`. Escutar `home-airport-changed` para re-sincronizar.
- **Trocar origem:** o `SearchAutocomplete` continua editável — o usuário pode apagar/digitar outra cidade. Adicionar pequeno botão "↺" ao lado para restaurar a origem padrão.
- **Data:** aplicar `min={MIN_DATE}` e `max={MAX_DATE}`. Em `onChange`, se valor inválido, mostrar erro inline (texto destrutivo abaixo do campo) e bloquear `handleSearch`. Toast continua como fallback.
- Aria-invalid + mensagens inline em PT/EN.

### 3. `TripPlannerModal.tsx` (primeira imagem — ano "222222")
- Campo de data: `max={MAX_DATE}` além do `min={today}` já existente.
- Validar via `clampDate`: se o usuário digitar ano > 2050 ou < ano atual, exibir erro "Escolha uma data entre hoje e 31/12/2050".
- **Orçamento:** usar `<Input type="text" inputMode="numeric" pattern="[0-9]*">` em vez de `type="number"` para eliminar o "e" (notação científica) e setas. Sanitizar `onChange` removendo tudo que não for dígito; aplicar clamp 500–1.000.000 com erro inline.
- **Dias:** mesma blindagem — sanitizar para dígitos, clamp 1–30, erro inline se fora da faixa.
- Manter botão "Próximo" desabilitado enquanto houver erro.

### 4. `TravelGuide.tsx`
- Trocar `Number(e.target.value)` cru pela mesma blindagem (inputMode numérico, sanitização, clamp 1–30, erro inline em PT/EN).
- Adicionar autocomplete (`SearchAutocomplete`) ou pelo menos pré-preencher destino com cidade padrão da conta como sugestão.

### 5. Padrão de erro
Todos os campos validados seguem o mesmo padrão já usado no `TripPlannerModal`:
```
<Input aria-invalid={!!error} className={error ? "border-destructive ..." : ""} />
{error && <p role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
```

## Detalhes técnicos
- `MAX_DATE = "2050-12-31"` codificado constante (sem timezone surpresas).
- `type="text" inputMode="numeric"` é a forma padrão de evitar `1e10`/`-`/`+` em inputs numéricos do navegador, mantendo teclado numérico no mobile.
- Nenhuma mudança de schema do banco; tudo client-side.
- i18n: todas as novas strings adicionadas em PT e EN inline (mesmo padrão dos arquivos atuais).

## Arquivos
- novo: `src/lib/dateLimits.ts`
- editar: `src/components/HeroSearch.tsx`
- editar: `src/components/TripPlannerModal.tsx`
- editar: `src/pages/TravelGuide.tsx`
