# Nuvei Legal — Design System (MASTER)

Source: `ui-ux-pro-max --design-system "legal operations contract risk dashboard enterprise" --density 8 --motion 3 --variance 3`,
with the skill's palette and typography overridden to keep the Nuvei brand (owner decision).

## Style
Minimalism & Swiss — flat, grid-based, high-contrast, functional. Enterprise dashboard density.

## Color (tokens in `app/globals.css`)
| Role | Token | Value |
|---|---|---|
| Ink / primary text | `primary` | `#000306` |
| Brand navy | `primary-container` | `#081F2C` |
| Brand red (CTA, high risk) | `secondary` | `#BA0037` |
| Page background | `background` | `#F7FAFC` |
| Surface (cards) | `surface-container-lowest` | `#FFFFFF` |
| Muted surface | `surface-container-low` | `#F1F4F6` |
| Muted text | `on-surface-variant` | `#43474B` |
| Border | `outline-variant` | `#C3C7CC` |

Red is reserved for primary CTAs and high/critical risk. Never use colour alone to convey risk — always pair with a text label.

## Typography
Inter (self-hosted, `@fontsource-variable/inter`). Body 14–16px, line-height 1.5. Labels: 11–12px uppercase, tracking-wider.

## Surfaces
- Cards: white, 1px `outline-variant` border, `rounded-lg`, **no shadow**.
- Overlays (modal, menus, toasts) may use a single sharp shadow.
- No gradients, glows, glassmorphism, or decorative motion.

## Spacing (density 8)
4 / 8 / 12 / 16 / 20 / 24 / 32 px. Card padding 20px; grid gaps 16px; section gaps 24px.

## Motion (motion 3)
150–200ms ease-out on hover/press only. Respect `prefers-reduced-motion`.

## Components (from the `/components` skill — smoothui, not hand-built)
smooth-button · basic-modal · animated-tabs · basic-accordion · basic-toast · dropdown-menu · drawer ·
skeleton-loader · animated-file-upload · animated-stepper · animated-progress-bar · ai-loader

## Pre-delivery checklist
- [ ] Icons are Material Symbols, `aria-hidden`, never emoji
- [ ] cursor-pointer on all clickable elements; visible focus rings
- [ ] Text contrast ≥ 4.5:1
- [ ] Touch targets ≥ 44px on mobile
- [ ] No horizontal scroll at 375 / 768 / 1024 / 1440
