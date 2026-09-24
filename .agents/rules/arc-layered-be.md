---
trigger: always_on
---

# Layered Architecture — Backend Rules

This project uses a strict 4-layer architecture: **Router → Controller → Service → Repository**. Each layer has one responsibility. Layers may only depend on the layer directly below them. Never skip layers. Never import sideways between features.

## Folder Structure

```
src/
├── api/                          # HTTP layer — only talks to HTTP
│   ├── middleware/               # Shared middleware (validate, errorHandler, ratelimit, clientContext)
│   └── v1/                       # API version namespace
│       ├── event/
│       │   ├── event.router.js   # Route definitions + multer config
│       │   ├── event.controller.js # req/res handling + payload mapping
│       │   └── event.validator.js  # Zod schemas (createXSchema, updateXSchema)
│       ├── register/
│       ├── invitation/
│       └── [feature]/            # Each feature gets its own folder with the same 3 files
├── core/                         # Business logic — no Express, no HTTP
│   ├── services/                 # makeXService({ deps }) factory functions
│   ├── repositories/             # makeXRepository({ prisma }) factory functions
│   └── errors/                   # Custom AppError subclasses
├── infra/                        # Infrastructure adapters
│   ├── db/                       # Prisma client singleton
│   ├── logger/                   # Pino setup + AsyncLocalStorage context
│   ├── mailer/                   # Nodemailer transporter
│   └── security/                 # JWT, bcrypt helpers
├── config/                       # Zod-validated env config (fail-fast on startup)
├── jobs/                         # node-cron background tasks
├── utils/                        # Pure utility functions (no side effects)
├── container.js                  # Awilix DI registrations — the only place that wires everything
└── server.js                     # Express bootstrap, middleware stack, route mounting
prisma/
├── schema.prisma                 # Source of truth for all models + enums
└── seed.js                       # Database seeding
```

## Layer Rules

### Router (`api/v1/{feature}/{feature}.router.js`)
- Must only define routes, attach middleware, and call controller functions
- Must handle multer setup and `handleUpload` wrapper at the router level
- Must validate with `validate(schema, { assign: true })` before the controller
- Never contain business logic or database access
- Never import from `core/services` or `core/repositories` directly

### Controller (`api/v1/{feature}/{feature}.controller.js`)
- Must only handle `req`, `res`, `next` — no business logic
- Must resolve service via `req.scope.resolve("xService")` or `req.scope.cradle.xService`
- Must map payload aliases before passing to service (`mapPayloadToPrisma`)
- Must map response back to client shape before sending (`mapPrismaToPayload`)
- Must catch errors with try/catch and pass to `next(error)`
- Never access `prisma` directly — all data access goes through service

### Service (`core/services/{feature}.service.js`)
- Must be created as a **factory function**: `export function makeXService({ dep1, dep2 }) { return { method1, method2 } }`
- Must contain all business logic: validation rules, status calculations, orchestration
- Must be the only layer that calls mailer, GCS, QR code generation
- Never import Express types (`req`, `res`) — services must be HTTP-agnostic
- Never access Prisma client directly — all queries go through repository

### Repository (`core/repositories/{feature}.repository.js`)
- Must be created as a **factory function**: `export function makeXRepository({ prisma }) { return { findAll, findById, create, update, delete: destroy } }`
- Must use `prisma.$transaction([...])` when multiple queries must be atomic
- Must only contain Prisma queries — no business logic, no conditional branching
- Use explicit `select: { ... }` when only a subset of fields is needed
- Method names must follow: `findAll`, `findById`, `findBySlug`, `create`, `update`, `destroy`

## DI Container Rules (`container.js`)

- Must register all dependencies in `container.js` — never instantiate services/repos inline
- Registration order: **infra singletons → repositories → services**
- Use `asValue()` for primitives (prisma, logger, env)
- Use `asFunction().singleton()` for all services and repositories
- Resolve at request time via `req.scope.resolve("name")` — never at module load time
- Never call `container.resolve()` outside of request middleware

## Validation Rules (`{feature}.validator.js`)

- Each feature must have its own validator file
- Schemas must wrap all input under `body`, `params`, and/or `query` keys:
  ```js
  export const createXSchema = z.object({
    body: z.object({ ... }),
    params: z.object({ ... }),  // only if needed
  });
  ```
- Always use `validate(schema, { assign: true })` on routes — this replaces `req.body/params/query` with the parsed, safe version
- Never add `.max()` to rich text / HTML fields (ReactQuill embeds base64)
- Enums in schema must match Prisma enums exactly: `z.enum(["ON_SITE", "ONLINE"])`

## Naming Conventions

| Context | Convention | Example |
|---|---|---|
| Files | `{feature}.{layer}.js` | `event.service.js` |
| Folders | `kebab-case` | `api/v1/event/` |
| Variables/Functions | `camelCase` | `getAllEvents`, `upcomingEvent` |
| DB columns (Prisma `@map`) | `snake_case` | `@map("start_date")` |
| Prisma model fields | `camelCase` | `startDate`, `allowAttend` |
| Factory functions | `makeXService` / `makeXRepository` | `makeEventService` |
| Zod schemas | `createXSchema` / `updateXSchema` | `updateEventSchema` |
| Error classes | `PascalCase` extending `AppError` | `NotFoundError`, `ConflictError` |

## Response Format

All responses must use this exact shape:

**Success:**
```js
res.json({ success: true, data: result })
res.status(201).json({ success: true, data: result })
```

**Success with pagination:**
```js
res.json({
  success: true,
  data: items,
  meta: { total, page, totalPages }
})
```

**Error (thrown in service, caught by global errorHandler):**
```js
throw new NotFoundError("Event not found")
// results in: { success: false, error: "Event not found" }
```

**Validation error (auto from validate middleware):**
```js
{ success: false, error: "Validation failed", details: [{ path, message, code }] }
```

## Error Handling Rules

- Never `return res.status(500).json(...)` manually — always `throw` or `next(error)`
- Always use custom error classes from `core/errors/httpErrors.js`
- Service layer throws domain errors (`NotFoundError`, `ConflictError`, etc.)
- Controller catches all errors with `try/catch` and calls `next(error)`
- The global `errorHandler` middleware is the single place that writes error responses
- Never swallow errors silently (`catch (e) {}` is forbidden)

## File Upload Rules

- All file upload config (multer storage, limits, fileFilter) lives in the **router file**, not controller
- `handleUpload` must wrap `upload.single()` to catch `MulterError` explicitly
- `fileSize` limit: 5MB — `fieldSize` limit: 10MB (for ReactQuill base64 in HTML fields)
- Controller sets `payload.image = req.file.filename` when `req.file` exists
- Database stores **only the filename**, never the full path or base64
- Serve uploaded files via `express.static` at `/uploads`, not through a controller

## Logging Rules

- Never use `console.log` — always use the Pino logger
- Obtain logger in service via DI: `makeXService({ logger })`
- Use `logger.info()`, `logger.warn()`, `logger.error()` with structured objects:
  ```js
  logger.info({ eventId: id }, "Event created")
  logger.error({ err: error, userId }, "Failed to send email")
  ```
- Never log sensitive fields: passwords, tokens, full email content

## Prisma / Database Rules

- `schema.prisma` is the single source of truth — never write raw SQL unless in a migration
- All model fields use `camelCase` in Prisma; map to `snake_case` DB columns via `@map()`
- Long text fields that receive HTML (from rich text editors) must use `@db.LongText`
- String fields that store filenames or short text default to `VARCHAR(191)` — do not add `@db.LongText` unless content is variable-length HTML
- Run `npx prisma migrate dev` for schema changes in development
- Run `npx prisma migrate deploy` for applying migrations in production
- Never use `prisma.$executeRaw()` for data that could be user-supplied (SQL injection risk)
