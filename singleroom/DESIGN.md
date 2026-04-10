# Design System Documentation: The Curated Waypoint

## 1. Overview & Creative North Star
This design system is built to redefine the hostel booking experience, moving it away from "budget-utility" and toward "curated hospitality." The Creative North Star for this system is **"The Digital Concierge."** 

Our goal is to break the rigid, "templated" look of travel aggregates by employing an editorial layout strategy. This involves intentional asymmetry, generous breathing room (whitespace as a luxury), and high-contrast typography scales. We replace structural lines with tonal depth, creating a UI that feels layered, tactile, and trustworthy—like a premium travel journal brought to life.

---

### 2. Colors
The color strategy utilizes a sophisticated palette of deep nautical blues for authority, verdant greens for freshness, and a vibrant teal to guide the eye.

*   **Primary (`#00317a`):** The foundation of trust. Used for core brand moments and high-priority interactions.
*   **Secondary (`#006e1c`):** Represents the "clean and green" promise. Used for sustainability badges, cleanliness ratings, and success states.
*   **Tertiary (`#003b44`):** The "vibrant teal" accent. Use this for discovery elements, active filters, and interactive highlights.
*   **The "No-Line" Rule:** To maintain a high-end feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts. For example, a card should be distinguished from the background by moving from `surface` to `surface-container-low`, not by adding an outline.
*   **Surface Hierarchy & Nesting:** Use the surface-container tiers to create depth. 
    *   **Level 1 (Base):** `surface` (`#f7f9fc`)
    *   **Level 2 (In-page Section):** `surface-container-low`
    *   **Level 3 (Interactive Card):** `surface-container-lowest` (`#ffffff`)
*   **The "Glass & Gradient" Rule:** Main CTAs or Hero sections should utilize a subtle vertical gradient from `primary` to `primary_container`. For floating navigation or over-image controls, apply a glassmorphism effect: `surface` color at 80% opacity with a 16px backdrop-blur.

---

### 3. Typography
We use a high-contrast pairing: **Manrope** for editorial impact and **Inter** for functional precision.

*   **Display & Headline (Manrope):** These are our "Voice" tokens. Use `display-lg` and `headline-md` for storytelling and destination titles. They should feel bold and authoritative.
*   **Title & Body (Inter):** These are our "Information" tokens. Use `title-lg` for card headings and `body-md` for property descriptions.
*   **Labels (Inter):** Use `label-md` for micro-copy and metadata. All labels should have a slightly increased letter-spacing (0.02em) to maintain a premium feel.
*   **The Editorial Edge:** Headlines should use a tighter line-height (1.1) to create a "locked" visual block, while body text should remain at a comfortable 1.5 to 1.6 ratio for maximum readability.

---

### 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, mimicking the way physical sheets of high-quality paper sit atop one another.

*   **The Layering Principle:** Instead of shadows, nest containers. Place a `surface-container-highest` element inside a `surface-container` to indicate a "pressed" or "contained" state.
*   **Ambient Shadows:** When an element must "float" (e.g., a booking modal or a fab), use a shadow tinted with the `on-surface` color at 6% opacity. Avoid generic black shadows; they look "dirty." Use a large blur (24px-32px) to simulate natural, soft light.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use the `outline-variant` token at 20% opacity. This provides a "ghost" of a line that guides the eye without cluttering the UI.
*   **Motion & Depth:** Transitions between surfaces should feel fluid. When a user interacts with a card, instead of an outline, transition the background color from `surface-container-lowest` to `surface-bright`.

---

### 5. Components

*   **Buttons:**
    *   **Primary:** `primary` fill, `on-primary` text, `lg` rounding (1rem). Apply a subtle inner-glow on hover.
    *   **Secondary:** `surface-container-highest` fill with `primary` text. No border.
*   **Input Fields:** Use `surface-container-low` as the background. On focus, transition to `surface-container-lowest` with a "Ghost Border" of `primary`.
*   **Cards (Property/Hostel):** 
    *   Radius: `xl` (1.5rem). 
    *   No dividers. Use vertical whitespace (24px - 32px) to separate the title from the metadata.
    *   Images should have a `sm` (0.25rem) inner corner radius when nested inside a card.
*   **Chips (Filters):** 
    *   Radius: `full` (9999px). 
    *   Unselected: `surface-container-high`.
    *   Selected: `tertiary-container` with `on-tertiary-container` text.
*   **Specialty Component: The "Cleanliness Badge":** A small, pill-shaped component using `secondary_fixed` background and `on_secondary_fixed` text, placed at the top-right of property images to emphasize the "clean/green" brand pillar.
*   **The Booking Widget:** A floating "Glass" container using `surface` at 85% opacity with a `primary` CTA. This should overlap section boundaries to break the grid.

---

### 6. Do's and Don'ts

#### Do
*   **Do** use asymmetrical layouts where images bleed off the edge of the screen or overlap container boundaries.
*   **Do** use `secondary` (green) accents for anything related to sustainability, health, or hygiene.
*   **Do** prioritize whitespace. If a layout feels "crowded," remove a container background rather than shrinking the text.
*   **Do** use `tertiary` (teal) for the "magic" moments—interactive maps, price highlights, and discovery buttons.

#### Don't
*   **Don't** use 100% black text. Always use `on-surface` or `on-surface-variant` for a softer, more organic feel.
*   **Don't** use sharp corners. Every element should have at least the `DEFAULT` (0.5rem) rounding to maintain the "approachable" brand personality.
*   **Don't** use divider lines. If you need to separate content, use a 1px tall block of `surface-variant` at 30% opacity, or simply increase the vertical padding.
*   **Don't** use standard drop shadows. If an element doesn't look elevated through color alone, re-evaluate the surface hierarchy first.