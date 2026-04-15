

# Site Review: Broken Images, Mismatched Images & Errors

## Issues Found

### 1. Images Without Correlation to Events

| Package | Image ID | Problem |
|---------|----------|---------|
| **Oktoberfest 2026** | `photo-1507003211169-0a1dd7228f2d` | This is a **portrait of a man's face**, not related to Oktoberfest/beer/Munich |
| **Olympics 2028** | `photo-1552674605-db6ffd4facb5` | This is a **person running/jogging** — generic fitness, not Olympic Games |
| **Super Bowl LXI** | `photo-1508180588132-3e4a1f6a2f7d` | This is an **abstract/sunset photo**, not related to American football |
| **Copa América 2028** | `photo-1489944440615-453fc2b6a9a9` | This is a **close-up of confetti/lights**, not football/Buenos Aires |
| **Champions League Final** | `photo-1431324155629-1a6deb1dec8d` | **Duplicate** — same image used for WC 2026 NY (soccer field). Works for both but ideally unique |
| **Toronto WC** | `photo-1517927033932-b3d18e61fb3a` | This is a **soccer player dribbling** — acceptable but generic |
| **Cannes Film Festival** | `photo-1509281373149-e957c6296406` | This is a **palm trees photo** — loosely related but not cinema/Cannes |
| **F1 Interlagos** | `photo-1504817343863-5092a923803e` | This is a **blurred racing car** — acceptable but verify it loads |
| **Día de los Muertos** | `photo-1509721434272-b79147e0e708` | Verify — may be a **skull/makeup** photo which is correct |

### 2. Duplicate Image Usage
- `photo-1431324155629-1a6deb1dec8d` used for both **WC 2026 NY** AND **Champions League Final**

### 3. No Code Errors Found
- CPF validation logic is correct
- Blog articles all have matching IDs between Blog.tsx and BlogPost.tsx
- Cart, checkout, and routing all appear functional
- Newsletter form and footer are intact

## Plan: Fix All Image Issues

### File: `src/lib/events-data.ts`

Replace these image URLs with correctly themed Unsplash photos:

1. **Oktoberfest** (line 580): Replace man portrait with an actual Oktoberfest/beer tent photo
2. **Olympics 2028** (line 205): Replace jogger with Olympic stadium/rings photo
3. **Super Bowl LXI** (line 290): Replace abstract photo with American football stadium
4. **Copa América 2028** (line 522): Replace confetti with football in Buenos Aires/stadium
5. **Champions League Final** (line 319): Replace duplicate with a unique Champions League/Allianz Arena photo
6. **Cannes Film Festival** (line 609): Replace palm trees with Cannes red carpet/Palais des Festivals
7. **Holi Festival** (line 667): Verify — should be colorful powder festival (likely correct)
8. **Sakura Japan** (line 725): Verify — should be cherry blossoms (likely correct)

All replacement images will be real Unsplash photos with direct URLs, following the project's image sourcing policy.

