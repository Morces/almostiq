---
name: AtmosIQ 
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1b202a'
  surface-container-high: '#252a35'
  surface-container-highest: '#303540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#c1c6d6'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#8b919f'
  outline-variant: '#414753'
  surface-tint: '#aac7ff'
  primary: '#aac7ff'
  on-primary: '#002f64'
  primary-container: '#3f90ff'
  on-primary-container: '#002958'
  inverse-primary: '#005db8'
  secondary: '#93ffde'
  on-secondary: '#00382b'
  secondary-container: '#00e9bd'
  on-secondary-container: '#006450'
  tertiary: '#b4c8e4'
  on-tertiary: '#1e3248'
  tertiary-container: '#7f92ac'
  on-tertiary-container: '#172b41'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458d'
  secondary-fixed: '#3bfed0'
  secondary-fixed-dim: '#00e0b5'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#005140'
  tertiary-fixed: '#d1e4ff'
  tertiary-fixed-dim: '#b4c8e4'
  on-tertiary-fixed: '#071d32'
  on-tertiary-fixed-variant: '#35485f'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#303540'
  surface-elevated: '#0D121F'
  surface-stroke: '#1E293B'
  text-muted: '#4A6585'
  glass-fill: rgba(13, 18, 31, 0.7)
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max-width: 1440px
---

## Brand & Style

The design system is built on a philosophy of "Actionable Intelligence." While traditional data platforms overwhelm users with metrics, this system prioritizes clarity, atmospheric depth, and precision. It draws from **Minimalism** and **Glassmorphism** to create a sophisticated, high-performance environment for decision-making.

The aesthetic is "Atmospheric Professional"—utilizing depth through translucent layers and subtle gradients that evoke the clarity of a high-altitude horizon. It targets C-suite executives and data scientists who require a tool that feels both powerful and effortless. The interface should feel like a high-end command center: calm, expansive, and highly focused.

## Colors

This design system utilizes a "Deep Space" palette. Instead of pure black, the foundation is a rich, saturated navy (`#03060F`), which provides better depth for glassmorphic effects.

- **Primary:** An electric atmospheric blue used for primary actions and "Intelligence" indicators.
- **Secondary:** A bright teal used sparingly for success states or highlighting positive AI-driven outcomes.
- **Tertiary:** A desaturated sky-blue used for secondary accents and subtle illustrations.
- **Neutral:** A range of slate grays and deep navies that maintain a cool temperature across the UI.

Gradients should be used behind glass containers to create a sense of light source and verticality, moving from darker navies at the bottom to slightly lighter, tinted blues at the top.

## Typography

Typography is used to establish an immediate hierarchy. **Inter** is the workhorse, chosen for its geometric precision and excellent legibility in complex data environments. 

- **Display & Headlines:** Use tight letter-spacing and heavy weights for a modern, "tech-first" editorial look.
- **Body:** Generous line-height is mandatory to maintain the minimalist feel and prevent data density fatigue.
- **Monospace:** **JetBrains Mono** is used for metadata, coordinates, and AI-generated confidence scores to differentiate raw data from actionable insights.

## Layout & Spacing

The layout utilizes a **Fixed Grid** system for dashboard views to ensure predictable data visualization, while landing and marketing pages utilize a more fluid, expansive approach. 

- **Desktop:** 12-column grid with 24px gutters. Content is centered in a 1440px max-width container.
- **Tablet:** 8-column grid with 16px gutters. 
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.

Whitespace is treated as a first-class citizen. Components should be grouped with generous margins (using multiples of 8px) to reinforce the "Atmospheric" narrative—giving the data "room to breathe."

## Elevation & Depth

Depth is created through **Glassmorphism** and **Tonal Layers** rather than traditional drop shadows.

1.  **Base Layer:** The deepest navy background.
2.  **Mantle Layer:** Subtle surface containers with a 1px border (`#1E293B`) and a slightly lighter fill.
3.  **Glass Layer:** Used for floating panels and modals. These use `backdrop-filter: blur(20px)` and a semi-transparent fill (`glass-fill`).
4.  **Accent Elevation:** High-priority cards use a "top-light" effect—a subtle 1px inner-border at the top edge (white at 10% opacity) to simulate a light source from above.

Avoid heavy, dark shadows; instead, use soft, blue-tinted glows (`primary_color` at 15% opacity) to indicate active or elevated states.

## Shapes

The shape language is sophisticated and approachable. A standard `0.5rem` (8px) radius is used for small elements like inputs and buttons, while large containers and cards use `rounded-lg` (16px) to emphasize the premium, modern aesthetic. 

Interactive elements should never be sharp-edged. The 16px corner radius for cards creates a "tablet-like" feel that is characteristic of modern SaaS platforms.

## Components

### Buttons
- **Primary:** Solid `primary_color` with white text. High-contrast, no shadow, 8px radius.
- **Secondary:** Ghost style with `surface-stroke` border and `primary_color` text. On hover, apply a 5% primary color background tint.

### Cards
- Cards are the core of the platform. They must feature a 1px border (`surface-stroke`) and a 16px corner radius.
- **Insight Cards:** Feature a secondary teal glow or left-accent border to denote "AI Actionable" content.

### Inputs
- Dark-themed inputs with a 1px border. Focus state moves the border to `primary_color` and adds a subtle 4px outer glow.

### Chips/Badges
- Small, pill-shaped (`rounded-xl`) with low-opacity backgrounds (e.g., 10% primary color) and 12px mono labels.

### Charts & Visualization
- Use the `secondary_color` (teal) for "Good/Growth" data and `primary_color` (blue) for "Neutral/Current" data. Gradients are encouraged for area charts to reinforce the atmospheric theme.