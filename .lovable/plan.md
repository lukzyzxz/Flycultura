
Plano simples e focado: adicionar fallback automático para imagens quebradas em todo o site, exibindo um placeholder temático baseado na categoria do conteúdo.

## Abordagem

Criar um componente reutilizável `<SmartImage />` que envolve a tag `<img>` nativa e:
1. Detecta erro de carregamento via `onError`
2. Substitui por um placeholder temático (Unsplash) baseado em uma prop `category` (ex: "event", "destination", "blog", "deal", "generic")
3. Mostra um skeleton animado enquanto carrega
4. Se o próprio fallback falhar, usa `/placeholder.svg` como último recurso

## Arquivos a criar/modificar

**Criar:**
- `src/components/SmartImage.tsx` — componente com lógica de fallback, skeleton e categorias temáticas

**Modificar (substituir `<img>` por `<SmartImage>`):**
- `src/components/DestinationCard.tsx` (category="destination")
- `src/components/RecentlyViewed.tsx` (category dinâmica conforme item.type)
- `src/components/ForYouSection.tsx` (category="event")
- `src/components/DiscoverySections.tsx` (category="event" / "deal")
- `src/pages/EventPackages.tsx` (category="event")
- `src/pages/PackageDetail.tsx` (category="event")
- `src/pages/Destination.tsx` (category="destination")
- `src/pages/Deals.tsx` (category="deal")
- `src/pages/Blog.tsx` + `src/pages/BlogPost.tsx` (category="blog")
- `src/pages/Cart.tsx` e `src/pages/Results.tsx` (category conforme item)

## Mapa de placeholders temáticos (Unsplash)

```text
event       → photo-1429962714451-bb934ecdc4ec  (multidão em festival)
destination → photo-1488646953014-85cb44e25828  (paisagem mundo)
deal        → photo-1488646953014-85cb44e25828  (viagem genérica)
blog        → photo-1455390582262-044cdead277a  (laptop/escrita)
generic     → /placeholder.svg                   (último recurso)
```

## Comportamento do componente

```text
[loading]   → skeleton animado (bg-muted animate-pulse)
[loaded]    → exibe imagem original
[error #1]  → troca src para placeholder temático da categoria
[error #2]  → troca src para /placeholder.svg local
```

A troca usa `useState` para `currentSrc` e `hasErrored` para evitar loops infinitos.
