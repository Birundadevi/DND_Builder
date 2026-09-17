# Mini Drag-and-Drop Layout Builder (React + TypeScript)

A high-performance visual component builder built with React 18, TypeScript, and Tailwind CSS. It features custom isolated drag handling, bulletproof JSON layout validation (Zod), and secure XSS-defensive input rendering.

## Architecture Highlights

1. **Performant Drag Behavior**: Moving a block bypasses global layout tree re-renders during active pointer move events by leveraging localized Pointer Events and memoized block rendering (`React.memo`).
2. **Defensive Security & Validation**: 
   - Runtime JSON schema validation on layout imports using **Zod**.
   - Strict text sanitization stripping raw angle brackets.
   - Guardrails against `javascript:` and `data:` URL injections in buttons/images.
3. **Single Source of Truth**: The active `blocks` state array within `BuilderContext` drives the entire canvas presentation reactively.

## Installation & Running

Ensure you have Node.js (v18+) installed.

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
