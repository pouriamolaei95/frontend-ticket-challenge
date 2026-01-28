## `src/` structure

This app is intentionally organized by responsibility to keep the codebase easy to scale and navigate:

- **`components/`**: Reusable UI building blocks (pure/presentational where possible).
- **`pages/`**: Route-level screens (composition + data fetching hooks).
- **`services/`**: API layer (real client and mock implementation while backend is in flight).
- **`types/`**: Shared TypeScript types for API and domain models.
- **`utils/`**: Small pure helpers (formatting, randomness, guards, etc).
- **`styles/`**: Global styles and shared CSS.

Testing utilities live in **`test/`**.

