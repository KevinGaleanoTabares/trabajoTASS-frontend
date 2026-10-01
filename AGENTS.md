# Repository Guidelines

## Structure

This workspace is an Angular 21 frontend with SSR. `src/main.ts` bootstraps `src/app/app.ts`; routes and providers are configured in `src/app/app.routes.ts` and `src/app/app.config.ts`. Under `src/app`, `core` owns services/guards/interceptors, `features` owns flows such as auth and the shared authenticated shell, `pages` owns screens, `shared` owns reusable components, and `utils` owns shared types. Components commonly use colocated `.ts`, `.html`, `.css`, and `*.spec.ts` files without `.component` in the filename; follow the nearest feature's pattern. Global styles are in `src/styles.css` and `src/styles/`. The environment directory is intentionally spelled `src/enviroments/`.

The API backend is a separate sibling repository (`../trabajoTASS-backend` when checked out alongside this frontend). Its Express entry point is `src/server.ts`; route mounts are in `src/routes/index.routes.ts`, then requests flow through routes/middleware to controllers, services, and models.

## Build, Test, and Development

Use Node.js with npm 10.8.2; `package-lock.json` is authoritative. Run `npm ci` to install frontend dependencies.

- Frontend: `npm run start:local` (port 11001), `npm run start:development`, `npm run build`, `npm run watch`, `npm test` (Angular/Vitest).
- Backend, if present: `npm run dev:local`, `npm run dev`, `npm run build`.
- The backend package has no test script, and this frontend has no configured E2E target; don't suggest `ng e2e` as an available project command.

Add or update neighboring `*.spec.ts` files for behavior changes and run the narrow relevant test, then `npm test` when practical. The frontend build is `npm run build`.

## Integration and Debugging

Frontend API URLs come from `src/enviroments/enviroment*.ts`; `core/services` makes HTTP requests and `core/interceptors/auth.interceptor.ts` attaches the JWT. The interceptor reads `localStorage`, so account for browser-versus-SSR execution when changing authentication code. Backend routes are mounted under `/api` and may require both authentication and role middleware. For API issues, trace the template action/component, service URL and payload, backend route and middleware, controller/service, then the response; inspect unresolved awaits or stream completion when Network shows a request stuck pending.

Keep role identifiers identical across the JWT, frontend route metadata, and backend authorization. There is a known mismatch to verify before changing role behavior: the user schema/frontend use `superAdmin`, while conflict routes authorize `super_admin`.

For CSS overflow or sizing issues, inspect the full layout chain, including parent grid/flex constraints and child `min-width`, rather than changing only the visible table or control. Verify the affected screen at desktop and mobile widths.

## Style and Configuration

Follow `.prettierrc`: two-space indentation, single quotes, 100-character print width, and Angular parsing for HTML. Keep changes scoped and follow nearby code patterns. Environment files select API endpoints; never commit `.env` contents, tokens, or credentials, and avoid exposing them in logs.

See [README.md](README.md) for the Angular CLI overview. The README's generic `ng e2e` suggestion is not configured in this project.
