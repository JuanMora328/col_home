---
name: Tierra y Hogar
colors:
  surface: '#fcf9f4'
  surface-dim: '#dcdad5'
  surface-bright: '#fcf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ee'
  surface-container: '#f0ede9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e5e2dd'
  on-surface: '#1c1c19'
  on-surface-variant: '#56423b'
  inverse-surface: '#31302d'
  inverse-on-surface: '#f3f0eb'
  outline: '#897269'
  outline-variant: '#dcc1b6'
  surface-tint: '#9d4315'
  primary: '#9a4113'
  on-primary: '#ffffff'
  primary-container: '#ba582a'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb597'
  secondary: '#496800'
  on-secondary: '#ffffff'
  secondary-container: '#c8f17a'
  on-secondary-container: '#4e6e00'
  tertiary: '#765700'
  on-tertiary: '#ffffff'
  tertiary-container: '#956e00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb597'
  on-primary-fixed: '#360f00'
  on-primary-fixed-variant: '#7d2d00'
  secondary-fixed: '#c8f17a'
  secondary-fixed-dim: '#add461'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#364e00'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f6be39'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#fcf9f4'
  on-background: '#1c1c19'
  surface-variant: '#e5e2dd'
  surface-parchment: '#fdfaf5'
  charcoal-text: '#2d2d2a'
  sage-muted: '#8ba888'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  display-lg-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  headline-md-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
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
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
  section-gap: 80px
---

## Brand & Style

The design system is rooted in the "Citizen Initiative" aesthetic—shifting away from commercial real estate's clinical efficiency toward a grassroots, community-focused movement. The visual narrative is defined by **Organic Minimalism**: a style that prioritizes human connection, warmth, and accessibility over corporate gloss.

The personality is modern yet grounded, evoking the feeling of a sun-baked courtyard rather than a glass-walled office. It avoids tech-heavy conventions like neon accents or deep shadows, opting instead for a "low-tech, high-trust" atmosphere that feels inclusive and neighborly. The target response is one of safety, optimism, and belonging.

## Colors

The palette transition from commercial to community is achieved through thermal shift—replacing cold whites with warm parchment and high-saturation oranges with sun-baked terracotta.

- **Primary (Terracotta):** A rich, clay-inspired hue (#c05d2e) representing the earth and the foundations of home. It is used for primary calls to action and key brand moments.
- **Secondary (Moss/Sage):** A soft, natural green (#6b8e23) that symbolizes growth, peace, and environmental harmony within the community.
- **Surface (Parchment):** The foundation is a warm, breathable parchment (#fdfaf5). This reduces eye strain and provides a softer backdrop than pure white.
- **Contrast (Charcoal):** To maintain legibility while avoiding the harshness of digital black, a deep charcoal (#2d2d2a) is used for all primary body text and headlines.

## Typography

The typography system balances the structural strength of **Montserrat** with the functional clarity of **Inter**. 

Headlines in Montserrat should feel "breathable"; generous letter-spacing (tracking) and ample line heights are mandated to prevent a cramped, commercial look. The body text uses Inter with a significantly increased line height (1.6x) to ensure the content feels approachable and easy to digest, particularly for users navigating complex social information. Headlines should never feel aggressive; they are the "steady voice" of the initiative.

## Layout & Spacing

This design system employs a **Fluid Grid** with an emphasis on "Open Air" margins.

- **Desktop:** A 12-column grid with a maximum container width of 1200px. Gutters are kept at 24px, but the outer margins are increased to 48px to give the content a framed, intentional feel.
- **Mobile:** A single-column layout with 20px margins to ensure text doesn't crowd the edges of the device.
- **Rhythm:** Vertical spacing between major sections (Section Gaps) is intentionally large (80px+) to allow the user's eyes to rest. Elements should be grouped logically using the "stack" units, prioritizing vertical clarity over horizontal density.

## Elevation & Depth

To avoid a "tech-heavy" or "SaaS" feel, the design system utilizes **Tonal Layering** and **Minimalist Diffusion**.

Depth is conveyed through subtle changes in surface color (e.g., moving from the parchment background to a slightly brighter or more saturated container) rather than heavy shadows. When shadows are necessary for functional elevation (such as on a floating action button or a modal), use **Extremely Soft, Diffused Shadows**. These shadows should have a very high blur radius, low opacity, and be tinted with a hint of the primary terracotta color (e.g., `rgba(192, 93, 46, 0.08)`) to maintain the warm, sun-baked aesthetic.

## Shapes

The shape language is defined by **pronounced softness**. By utilizing a base 12px (rounded-md) corner radius, the design system removes the "sharpness" associated with corporate portals. This creates a tactile, friendly interface. 

- **Interactive Elements:** Buttons and inputs use the base 12px radius.
- **Large Containers:** Cards and image containers use `rounded-xl` (24px) to create a distinct, nested feel that suggests shelter and enclosure.
- **Media:** All photography and icons must follow these rounding rules; no sharp 90-degree corners are permitted in the interface.

## Components

- **Buttons:** Primary buttons are solid Terracotta with white text. They should feel "heavy" and grounded. Secondary buttons use a Sage Green outline with a slightly thicker 2px stroke to ensure they feel handcrafted rather than industrial.
- **Cards:** Housing and community cards sit on a pure white or very light cream surface. They use the `rounded-xl` radius and the soft terracotta-tinted shadow to appear as if they are gently floating on the parchment background.
- **Input Fields:** Fields are tall and welcoming, featuring a 2px border in a muted sage or clay tone. On focus, the border thickens and shifts to the primary Terracotta.
- **Chips & Tags:** Used for housing attributes. These should be pill-shaped with a soft Sage background and dark charcoal text, emphasizing a "growth and peace" metadata layer.
- **Lists:** Lists should be separated by generous vertical padding and subtle, low-contrast horizontal lines that don't span the full width of the container, maintaining an "informal" but organized look.
- **Photography:** All imagery should be warm-toned, featuring real community interactions and natural light. Avoid staged "real estate" photography in favor of lived-in, authentic environments.