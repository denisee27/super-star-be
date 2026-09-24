---
trigger: always_on
---

# Express & Node.js — Backend Rules

Conventions untuk semua code di project ini. Berlaku di semua layer. Tidak ada pengecualian kecuali ada komentar explicit yang menjelaskan alasannya.

## Module System

- Always use **ESM** (`import`/`export`) — never `require()`
- File extensions must be `.js` (not `.mjs`)
- All imports at the top of the file — never dynamic `import()` unless lazy-loading is intentionally required
- Named exports preferred over default exports for services, repositories, and utilities
- Default export only for: router files, the container, and server entry point

## Async / Error Handling

- Always `async/await` — never `.then().catch()` chains
- Every `async` controller function must have `try/catch` that calls `next(error)`
- Every `async` service method throws typed errors (`NotFoundError`, `ConflictError`, etc.) — never returns `null` to signal failure
- Never `await` inside a loop — use `Promise.all()` for parallel async operations
- Never ignore the return value of a Promise without explicit reason

```js
// Correct
export const getEvent = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// Wrong — missing try/catch
export const getEvent = async (req, res, next) => {
  const event = await eventService.getEventById(req.params.id);
  res.json({ success: true, data: event });
};
```

## Route Definitions

- Route paths use `kebab-case`: `/allow-attend`, `/send-feedback`
- Route params use camelCase in code, kebab-case in path: `/:participantId`, `/:eventId`
- Group related routes in the same router file — never define routes in controller or service
- Specific routes must come before parameterized routes:
  ```js
  router.get("/slug/:slug", ...)   // specific — before
  router.get("/:id", ...)          // parameterized — after
  ```
- Always use `router.get/post/patch/delete` — never `app.get(...)` directly

## Middleware Order (in server.js)

Must follow this exact order — changing it breaks security or logging:
1. `helmet` (security headers)
2. `cors` (cross-origin)
3. `express.json({ limit: "10mb" })` (body parsing)
4. `express.urlencoded({ extended: true, limit: "10mb" })`
5. `cookieParser`
6. `express.static` (for `/uploads`)
7. `httpLogger` + `requestContext` (logging)
8. `clientContext`
9. Rate limiter (`apiLimiter`)
10. DI scope injection
11. Route handlers
12. 404 handler
13. `errorHandler` — must always be last

## Environment Config

- Never access `process.env.X` directly in any file other than `src/config/index.js`
- Always import from `src/config/index.js`: `import { env } from "./config/index.js"`
- Config must be Zod-validated at startup — if a required variable is missing, the process must exit immediately
- Secrets (JWT, SMTP passwords, API keys) must never be logged or included in error messages

## Code Style

- No `var` — use `const` by default, `let` only when reassignment is needed
- No unused variables — they indicate incomplete code or forgotten cleanup
- Destructure where it improves readability: `const { id } = req.params`
- Avoid deeply nested ternaries — use early returns or if/else
- Max function length: if a function exceeds ~40 lines, it probably needs to be split
- No magic numbers — extract to named constants if used more than once

## Comments

- Write comments only for non-obvious WHY, not WHAT
- Never describe what the next line does — the code does that
- Do write a comment for: Prisma workarounds, known business rule constraints, intentional unusual patterns
- Inline `// TODO:` is allowed only in development — must not be committed without a ticket reference

## Security Rules

- Never interpolate user input into raw SQL strings (`prisma.$executeRaw` with template literals)
- Never serve user-uploaded files without validating MIME type first (fileFilter in multer)
- Never expose stack traces in production responses — `errorHandler` already handles this
- Never store passwords in plain text — always hash with bcrypt before saving
- Always validate `req.params.id` with `z.string().uuid()` to prevent injection via UUID fields
- Rate limiting is already applied globally — do not remove `apiLimiter` from server.js

## Background Jobs (`jobs/`)

- Each job is a single file that exports an `init` function: `export function initXJob()`
- Jobs must not import directly from controller or router — only from services
- Jobs must use the shared logger, not console
- Long-running jobs must be cancellable (store interval/cron reference and clear on shutdown)

## Adding a New Feature — Checklist

When adding a new feature (e.g., `speaker`), create these files in order:

1. `prisma/schema.prisma` — add model + run `npx prisma migrate dev`
2. `src/core/repositories/speaker.repository.js` — data access only
3. `src/core/services/speaker.service.js` — business logic
4. `src/api/v1/speaker/speaker.validator.js` — Zod schemas
5. `src/api/v1/speaker/speaker.controller.js` — req/res handlers
6. `src/api/v1/speaker/speaker.router.js` — routes + middleware
7. `src/container.js` — register `speakerRepository` and `speakerService`
8. `src/server.js` — mount router at `/api-event/speaker`

Never skip a layer. Never merge two layers into one file.
