# Design System: Editorial Intelligence

## 1. Overview & Creative North Star
**The Creative North Star: "The Cinematic Archivist"**

This design system is not a utility; it is a narrative environment. It rejects the "Generic SaaS" aesthetic—characterized by bright whites, heavy borders, and loud primary colors—in favor of a high-end, editorial-tech experience tailored for the Brazilian AI landscape. 

The visual language draws inspiration from cinematic UI (FUI) and premium print journalism. It prioritizes depth over flatness and atmosphere over raw data density. By utilizing intentional asymmetry, oversized typography scales, and a "Deep Plum" tonal range, we create a space that feels both technologically advanced and intellectually sophisticated. We move away from "robot" imagery toward abstract light-play and disciplined, spacious layouts.

---

## 2. Colors & Surface Logic

The palette is rooted in the "Deep Background" (#0B060D), moving away from pure blacks into a more sophisticated, tinted dark mode.

### Tonal Surface Hierarchy
| Token | Hex/Value | Role |
| :--- | :--- | :--- |
| **Surface (Base)** | `#0B060D` | The foundational canvas. |
| **Surface-Low** | `#160915` | Secondary containers/navigation rails. |
| **Surface (Tinted Glass)** | `rgba(103, 34, 89, 0.22)` | The signature "Free-Plaud" glass. Requires `blur(18px)`. |
| **Primary (Accent)** | `#CA52B3` | High-importance actions and focus states. |
| **Secondary (Indigo)** | `#6477D1` | Technical callouts and data visualization. |

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for structural sectioning. Boundaries must be defined by:
1.  **Background Shifts:** Transitioning from `surface` to `surface-container-low`.
2.  **Negative Space:** Using the generous spacing scale to imply containment.
3.  **Tonal Transitions:** Subtle linear gradients (e.g., `#0B060D` to `#160915`) to define the edge of a section.

### Glass & Texture
Floating elements (modals, dropdowns, hovered cards) must use the **Tinted Glass** surface. To provide "soul," use a subtle radial gradient on the background: a 40% opacity Magenta or Indigo glow positioned off-center behind the glass to simulate ambient light passing through a lens.

---

## 3. Typography: The Editorial Voice

We utilize a three-font system to balance technical precision with high-fashion editorial impact.

*   **Display & Headings: 'Space Grotesk'**
    A tech-leaning sans with idiosyncratic terminals. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) for hero moments. This conveys authority and modernity.
*   **Body & UI: 'IBM Plex Sans'**
    A highly legible, neutral workhorse. It grounds the "Space Grotesk" headings, providing a reliable, humanistic feel for long-form content.
*   **Microcopy & Metadata: 'JetBrains Mono'**
    Reserved for labels, timestamps, and AI-generated code. It signals the "Technical" layer of the project.

---

## 4. Elevation & Depth: The Layering Principle

We achieve hierarchy through **Tonal Layering** rather than structural lines or heavy shadows.

*   **The Layering Principle:** Imagine the UI as stacked sheets of dark, polished obsidian. Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" look.
*   **Ambient Shadows:** If an element must float, use a shadow with a `40px to 60px` blur and `4%` opacity. The shadow color should be `#6477D1` (Indigo) or `#CA52B3` (Magenta) rather than black, creating an atmospheric glow.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `Border` token (`rgba(229, 173, 230, 0.18)`). It must feel like a hair-line reflection on the edge of glass, never a heavy enclosure.

---

## 5. Components

### Buttons
*   **Primary:** Background: `#CA52B3` (Magenta). Text: `#F7F4FB`. Corner Radius: `full`.
*   **Secondary (Glass):** Background: Tinted Glass. Border: Ghost Border. Text: `#F7F4FB`.
*   **Interaction:** On hover, primary buttons should emit a soft Magenta glow (`box-shadow: 0 0 20px rgba(202, 82, 179, 0.3)`).

### Input Fields
*   **Surface:** `surface-container-highest` or `Surface-Low`.
*   **State:** 2px bottom-border only (Magenta) on focus. No full-box focus rings.
*   **Corner Radius:** `sm` (0.5rem) for inputs to distinguish from the `xl` (3rem) layout containers.

### Cards & Lists
*   **No Dividers:** Prohibit the use of horizontal rules (`<hr>`). Use vertical white space (32px+) or a background shift to separate list items.
*   **Corners:** Use the `xl` (3rem) or `lg` (2rem) radius for all main content cards to maintain the "Soft/Premium" feel.

### The "Pulse" Indicator
A signature component for this system: A small, blurred Indigo or Magenta circle that pulses slowly in the background of active AI processing states. It should feel like a breathing light, not a spinning loader.

---

## 6. Do’s and Don’ts

### Do
*   **Embrace Asymmetry:** Align a heading to the left and a description card to the right with 20% empty space between them.
*   **Use Oversized Spacing:** If you think there’s enough padding, double it.
*   **Tint Your Greys:** Every "neutral" color must have a hint of plum or indigo. Pure grey is forbidden.

### Don’t
*   **No Generic Icons:** Avoid "Outline" icon sets. Use filled, high-contrast glyphs or custom SVG illustrations that mimic technical blueprints.
*   **No Sharp Corners:** Except for the very edges of the screen, everything should feel smoothed and polished.
*   **No Heavy Borders:** If a user can see the border from a distance, it is too thick. It should only be visible upon close inspection as a "glint."