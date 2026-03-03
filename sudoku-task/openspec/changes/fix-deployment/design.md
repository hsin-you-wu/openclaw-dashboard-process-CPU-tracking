## Context

The application is a React + Vite-based Sudoku game deployed on Vercel. Vite builds the application into a `dist/` directory containing static assets and `index.html`. When deployed to Vercel, direct navigation to nested routes (e.g., `/sudoku/game`) or page refreshes result in 404 errors because Vercel's default behavior serves the physical file structure rather than routing all requests to `index.html` for client-side handling.

## Goals / Non-Goals

**Goals:**
- Configure Vercel to route all requests to `index.html` for SPA routing
- Verify Vite build output directory is correctly set to `dist`
- Ensure build artifacts are properly placed for Vercel to serve them
- Eliminate 404 errors on direct navigation and page refresh

**Non-Goals:**
- Modify application routing logic or React components
- Change build process or build commands
- Add server-side rendering or API routes
- Optimize build size or performance

## Decisions

**1. Use vercel.json for Routing Configuration**
- *Decision*: Add `vercel.json` in project root with `rewrites` configuration
- *Rationale*: Standard Vercel approach for SPA routing, no code changes needed, simple and maintainable
- *Alternative Considered*: Use `_redirects` file (Vercel doesn't support this format natively)

**2. Route All Non-Asset Requests to index.html**
- *Decision*: Configure rewrites to match all paths except static assets and send to `/index.html`
- *Rationale*: Allows React Router or client-side router to handle all navigation
- *Alternative Considered*: Use wildcard routing (less precise, may catch API routes)

**3. Verify Vite Configuration**
- *Decision*: Check vite.config.ts confirms `build.outDir: 'dist'`
- *Rationale*: Ensures Vercel knows where to find built assets
- *Alternative Considered*: None; this is standard practice

## Risks / Trade-offs

**[Risk] Overly broad rewrites could mask missing static files**
→ *Mitigation*: Configure rewrites to exclude common static asset patterns (.js, .css, .svg, etc.)

**[Risk] Vercel caching of old configurations**
→ *Mitigation*: Redeploy after adding vercel.json to ensure new config is applied

**[Trade-off] All non-asset requests go to index.html**
→ This is necessary for SPA routing but means 404 pages aren't served from server (handled client-side)
