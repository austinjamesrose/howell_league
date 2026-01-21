# Howell League UI Redesign Plan

## Overview

**Concept:** "Sports Bar Scoreboard"
**Aesthetic:** Dark theme with warm amber/gold accents, scoreboard typography, competitive gambling energy
**Target Audience:** Six high school buddies competing in a QB-only fantasy league

---

## Design System

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0D0D0D;      /* Near-black base */
  --bg-surface: #1A1A1A;      /* Card backgrounds */
  --bg-elevated: #242424;     /* Hover states, modals */

  /* Borders & Lines */
  --border-subtle: #2A2A2A;
  --border-default: #3A3A3A;

  /* Brand Colors */
  --gold: #F5A623;            /* Winners, 1st place, primary accent */
  --gold-dim: #B8860B;        /* Muted gold */
  --amber: #FFBF00;           /* Highlights */

  /* Semantic Colors */
  --danger: #FF4757;          /* Losers, worst QB, negative money */
  --danger-dim: #C0392B;
  --success: #2ECC71;         /* Positive money */
  --success-dim: #27AE60;

  /* Medal Colors */
  --silver: #C0C0C0;
  --bronze: #CD7F32;

  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-muted: #666666;

  /* Effects */
  --glow-gold: 0 0 20px rgba(245, 166, 35, 0.3);
  --glow-danger: 0 0 20px rgba(255, 71, 87, 0.3);
}
```

### Typography

**Primary Font: Oswald**
- Use: Headlines, rankings, team names
- Weight: 400 (regular), 700 (bold)
- Style: ALL CAPS for impact

**Secondary Font: IBM Plex Mono**
- Use: Stats, numbers, points, data
- Weight: 400, 500, 600
- Style: Tabular figures for alignment

**Body Font: Inter**
- Use: Body text, descriptions, rules
- Weight: 400, 500, 600
- Style: Normal case

**Google Fonts Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Spacing Scale

```
4px   - xs (tight)
8px   - sm
16px  - md (default)
24px  - lg
32px  - xl
48px  - 2xl
64px  - 3xl
```

### Border Radius

```
4px  - sm (buttons, badges)
8px  - md (cards, inputs)
12px - lg (modals, large cards)
```

---

## Component Designs

### 1. Navigation Header

```
┌─────────────────────────────────────────────────────────────────┐
│ ▰▰▰ HOWELL LEAGUE                    [Nav Links]        [Admin]│
│     2025 Season • QB Only                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Specs:**
- Background: `--bg-surface` with subtle grain texture
- Logo: Oswald Bold, gold color, decorative brackets
- Nav links: Inter Medium, white, gold underline on active
- Height: 64px desktop, 56px mobile
- Sticky on scroll

### 2. Standings Table

**Desktop Layout:**
```
╔═══════════════════════════════════════════════════════════════════╗
║ RK │ TEAM              │ OWNER           │ PAYOUT  │ TOTAL PTS   ║
╠═══════════════════════════════════════════════════════════════════╣
║ 👑 │ TEAM BMOC         │ Sean McLaughlin │ +$420   │ 1,831.80   ║ ← Gold glow
╠───────────────────────────────────────────────────────────────────╣
║ 🥈 │ Team Jar-Jar      │ Brad Foster     │ $0      │ 1,711.88   ║
╠───────────────────────────────────────────────────────────────────╣
║ 🥉 │ Team AP           │ Austin Poncelet │ -$70    │ 1,563.88   ║
╠───────────────────────────────────────────────────────────────────╣
║ #4 │ Team Mojo         │ Marc Orlando    │ -$70    │ 1,497.60   ║
╠───────────────────────────────────────────────────────────────────╣
║ #5 │ Team TK           │ Tyler Krieger   │ -$70    │ 1,298.20   ║
╠═══════════════════════════════════════════════════════════════════╣
║ 💀 │ TEAM ROSE         │ Austin Rose     │ -$210   │   938.30   ║ ← Red glow
╚═══════════════════════════════════════════════════════════════════╝
```

**Row Treatments:**
- 1st place: Gold left border, subtle gold glow, gold text for points
- 2nd place: Silver accent
- 3rd place: Bronze accent
- 4th-5th: Neutral
- 6th place: Red left border, danger zone styling, skull emoji

**Points Display:**
- IBM Plex Mono
- Large size (text-xl)
- Color matches position (gold/white/red)

### 3. Worst QB "Hall of Shame" Section

```
┌─────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░                                                           ░  │
│  ░   🚨  HALL OF SHAME  🚨                                   ░  │
│  ░                                                           ░  │
│  ░   WORST QB OF THE 2025 SEASON                            ░  │
│  ░                                                           ░  │
│  ░          ANTHONY RICHARDSON                               ░  │
│  ░          IND • Team Rose                                  ░  │
│  ░                                                           ░  │
│  ░              0.26 PTS                                     ░  │
│  ░                                                           ░  │
│  ░   "The league shall bear this name come February"        ░  │
│  ░                                                           ░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────────────────────────────┘
```

**Specs:**
- Background: Dark red gradient with scanline overlay
- Border: Animated red glow pulse
- Typography: Oswald for name, IBM Plex Mono for points
- Optional: Subtle flicker/glitch animation

### 4. Team Roster Cards

```
┌─────────────────────────────────────┐
│  TEAM AP                           │
│  Owner: Austin Poncelet            │
│  ─────────────────────────────────  │
│  ★ 1. Bo Nix (DEN)         388.84 │
│  ★ 2. Justin Herbert (LAC) 362.88 │
│  ★ 3. Baker Mayfield (TB)  330.92 │
│  ★ 4. C.J. Stroud (HOU)    279.54 │
│  ★ 5. Tua Tagovailoa (MIA) 201.70 │
│  ────────────────────────────────── │
│    6. Bryce Young (CAR)     98.42 │ ← Dimmed
│    7. Russell Wilson (NYG)  45.20 │
│    8. Deshaun Watson (CLE)   0.00 │
└─────────────────────────────────────┘
```

**Specs:**
- Dark card with subtle border
- Team name: Oswald, white
- Top 5: Gold star marker, full opacity
- Bench: No star, 60% opacity
- Points: IBM Plex Mono, right-aligned

### 5. QB Detail Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back                                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MATTHEW STAFFORD                              530.38 PTS      │
│  LAR • Team BMOC                               ═══════════      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │ STATS    │  │ BONUSES  │  │ PLAYOFFS │                      │
│  │ 471.38   │  │ 50.00    │  │ 9.00     │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
│                                                                 │
│  SEASON STATS                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PASS YDS  │ RUSH YDS │ PASS TD │ RUSH TD │ INT │ FUM   │   │
│  │   4,707   │     1    │   46    │    0    │  8  │   2   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ REG WINS (3 pts)  │ PRIME WINS (4 pts)                  │   │
│  │      11 (33 pts)  │      1 (4 pts)                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6. Player Leaderboard

```
╔═══════════════════════════════════════════════════════════════╗
║  PLAYER STANDINGS                                             ║
║  All quarterbacks ranked by total points                      ║
╠═══════════════════════════════════════════════════════════════╣
║  🥇  Matthew Stafford    LAR   Team BMOC      530.38         ║
║  🥈  Josh Allen          BUF   Team Mojo      473.62         ║
║  🥉  Drake Maye          NE    Team Mojo      462.76         ║
╠───────────────────────────────────────────────────────────────╣
║  #4  Trevor Lawrence     JAX   Team Jar-Jar   452.18         ║
║  #5  Caleb Williams      CHI   Team BMOC      399.98         ║
║  ...                                                          ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## Page-by-Page Implementation

### Phase 1: Foundation (Files to modify)

1. **tailwind.config.js** - Add custom colors, fonts, extend theme
2. **index.css** - Import fonts, base dark styles, CSS variables
3. **Layout.jsx** - New header design, dark background

### Phase 2: Home Page

1. **Home.jsx** - Complete redesign
   - New standings table component
   - Redesigned "Hall of Shame" section
   - Top 5 QB cards with new styling

### Phase 3: Secondary Pages

1. **Rosters.jsx** - Team cards, tab navigation
2. **PlayerStandings.jsx** - Leaderboard table
3. **QBDetails.jsx** - Stat display cards
4. **LeagueRules.jsx** - Document styling
5. **AllTimeMoney.jsx** - Fix blank page + new design
6. **Admin.jsx** - Dark theme form styling

### Phase 4: Polish

1. Add loading skeletons
2. Hover animations
3. Page transitions
4. Mobile optimizations

---

## File Change Summary

| File | Changes |
|------|---------|
| `tailwind.config.js` | Custom colors, fonts, extend theme |
| `index.css` | Google Fonts, CSS variables, base dark styles |
| `Layout.jsx` | Complete header redesign |
| `Home.jsx` | New standings table, Hall of Shame |
| `Rosters.jsx` | Dark cards, team tabs |
| `PlayerStandings.jsx` | Leaderboard styling |
| `QBDetails.jsx` | Stat cards redesign |
| `LeagueRules.jsx` | Document styling |
| `AllTimeMoney.jsx` | Fix + redesign |
| `Admin.jsx` | Dark form styling |

---

## Animation Specifications

### Micro-interactions

1. **Row hover:** Subtle lift + glow increase
2. **Tab switch:** Slide + fade transition
3. **Number changes:** Ticker animation (optional)
4. **Page load:** Staggered fade-in for rows

### Key Animations

```css
/* Gold glow pulse for 1st place */
@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(245, 166, 35, 0.2); }
  50% { box-shadow: 0 0 30px rgba(245, 166, 35, 0.4); }
}

/* Red alert for worst QB */
@keyframes dangerPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 71, 87, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 71, 87, 0.5); }
}

/* Scanline effect */
@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

---

## Mobile Considerations

- Hamburger menu with slide-out drawer
- Standings table: Hide "Owner" column on mobile
- Cards stack vertically
- Touch-friendly tap targets (min 44px)
- Swipe between teams on Rosters page

---

## Success Metrics

- [ ] All pages render with dark theme
- [ ] Typography is consistent (Oswald/IBM Plex Mono/Inter)
- [ ] 1st place has gold treatment
- [ ] Last place has danger treatment
- [ ] "Hall of Shame" section is visually striking
- [ ] All-Time $ page works (currently broken)
- [ ] Mobile responsive
- [ ] No Tailwind default blue visible
- [ ] Feels like a sports bar scoreboard, not a SaaS dashboard

---

## Implementation Order

1. `tailwind.config.js` - Theme setup
2. `index.css` - Base styles + fonts
3. `Layout.jsx` - Header + dark background
4. `Home.jsx` - Main standings redesign
5. `Rosters.jsx` - Team cards
6. `PlayerStandings.jsx` - Leaderboard
7. `QBDetails.jsx` - Detail page
8. `LeagueRules.jsx` - Rules styling
9. `AllTimeMoney.jsx` - Fix + style
10. `Admin.jsx` - Admin dark theme

---

*Created: January 20, 2026*
*Design Direction: Sports Bar Scoreboard*
