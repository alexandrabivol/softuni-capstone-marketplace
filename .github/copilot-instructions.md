# Project Context & Guidelines
You are assisting in developing a vanilla JavaScript web application built with Vite and Bootstrap, using Supabase as the backend.

## Architectural Rules
- Strict Multi-Page Navigation: Every main screen must be a separate HTML file (e.g., index.html, login.html). Do not use single-page application (SPA) client-side routing.
- Modular Design: Separate UI logic from business logic. Keep API calls in a dedicated `src/services/` folder.
- No Frameworks: Do not use React, Vue, Angular, or TypeScript. Stick to standard JavaScript (ES6+), HTML, and Bootstrap CSS.
- Security: Always assume row-level security (RLS) is active. Ensure user tokens and sessions are handled securely via the Supabase JS client.
