# SSR Readiness Backlog

This project currently runs as a client-side SPA and reads browser APIs (`localStorage`, `window`, `document`) directly in page modules.

## Goal

Prepare a safe migration path to SSR (Next.js or Remix) without breaking current behavior.

## Current blockers

- Many pages read `localStorage` during render.
- Direct browser API access in route components.
- No server-safe storage abstraction used across data access functions.

## Incremental migration plan

1. **Storage boundary**
   - Use `src/app/lib/storageAdapter.ts` as the only read/write entrypoint.
   - Replace direct `localStorage` calls in page modules with adapter/helper usage.

2. **Hydration-safe reads**
   - Move browser-only reads into `useEffect` or guard with `typeof window !== "undefined"`.
   - For SSR routes, render loading placeholders then hydrate client-side data.

3. **Document/metadata boundary**
   - Keep metadata updates in hooks (`useDocumentMeta`) and no-op safely server-side.

4. **Routing split**
   - Keep public indexable routes SSR/prerender-friendly.
   - Keep private/workshop routes noindex until server auth and data model are available.

5. **Framework migration checkpoint**
   - After steps 1-4 are complete, evaluate moving to Next.js App Router or Remix.
   - Reuse existing route-level components with minimal UI changes.

## Acceptance criteria before SSR migration

- No direct `localStorage` access in route component render paths.
- No unguarded `window`/`document` use at module top level.
- Public routes can render meaningful HTML without client data.

