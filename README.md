# Visual Board Studio — React + TypeScript Mini Drag-and-Drop Builder

A production-grade, highly performant, and secure visual layout builder built with React, TypeScript, and Tailwind CSS. It features custom pointer-event drag handling, snap-to-grid alignment guides, live properties customization, undo/redo history stacks, and strict runtime JSON schema validation.

---

## 🚀 Core Features

1. **Component Palette & Drag-and-Drop Canvas:**
   - Palette containing 4 distinct block types: **Text**, **Image**, **Button**, and **Container**.
   - Drag items directly from the palette onto precise coordinates on the canvas, or click them to instantly spawn.
   - Smooth movement with pointer capture and GPU-accelerated 3D transforms (`translate3d`).

2. **Live Properties Panel:**
   - Inspect and configure text content, source URLs, alt text, font sizes, colors, and dimensions dynamically.
   - Local state input binding prevents focus loss or re-render thrashing during typing.

3. **Undo / Redo History:**
   - Full history state stacks (`past`, `present`, `future`) tracking all block creations, moves, style updates, and deletions.

4. **Snap-to-Grid & Alignment Guides:**
   - Automatic grid snapping (20px intervals) and edge alignment guides when dragging blocks near other layout items.

5. **Serialization (Save & Load):**
   - Export your entire layout as a formatted JSON file or import a saved JSON layout to instantly reproduce it.

6. **Defensive Security & Validation:**
   - **Runtime Schema Validation:** Incoming JSON imports are strictly checked using **Zod** schema validation to reject malformed or unexpected structures.
   - **XSS & Injection Defense:** User text strings are sanitized to strip raw angle brackets (`<>`), and URLs are verified against `javascript:` or `data:` script injection vectors.

7. **Automated Testing Setup:**
   - Configured with **Vitest** and **React Testing Library** for component and state verification.

---

## 📦 Installed Packages & Justification

| Package | Version | Purpose & Justification |
| :--- | :--- | :--- |
| **`react` / `react-dom`** | `^18.2.0` | Core UI library using functional components and hooks. |
| **`lucide-react`** | `^0.344.0` | Provides clean, scalable SVG icons for the toolbar, palette, and actions. |
| **`zod`** | `^3.22.4` | Enterprise-grade runtime schema validation to safely parse and validate imported JSON layout structures. |
| **`tailwindcss` / `@tailwindcss/vite`** | `^4.0.0` | Utility-first CSS framework for clean, responsive, and modern interface styling. |
| **`vitest`** | Latest | Fast, Vite-native test runner for executing automated unit and component tests. |
| **`@testing-library/react`** | Latest | Utilities for testing React components in a simulated DOM environment. |
| **`jsdom`** | Latest | Headless browser environment required by Vitest to execute DOM tests. |

---

## 🗂️ Project Structure

```text
dnd-builder/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── block.ts
    ├── utils/
    │   ├── sanitize.ts
    │   ├── validate.ts
    │   ├── helpers.ts
    │   └── snap.ts
    ├── state/
    │   └── BuilderContext.tsx
    ├── hooks/
    │   └── useBuilder.ts
    └── components/
        ├── Toolbar.tsx
        ├── Palette.tsx
        ├── Canvas.tsx
        ├── Block.tsx
        └── PropertiesPanel.tsx
