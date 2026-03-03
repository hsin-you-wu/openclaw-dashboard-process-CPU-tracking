## ADDED Requirements

### Requirement: Add vercel.json for SPA routing
The system SHALL include a `vercel.json` file in the project root that configures Vercel to route all non-static requests to `index.html` for proper SPA navigation.

#### Scenario: Create vercel.json configuration
- **WHEN** project is built for Vercel deployment
- **THEN** vercel.json file exists in project root with rewrites configuration for SPA routing

#### Scenario: Rewrite routes to index.html
- **WHEN** user navigates directly to any nested route (e.g., `/sudoku/game`)
- **THEN** Vercel rewrites the request to `/index.html` without changing the URL

#### Scenario: Preserve static asset requests
- **WHEN** a request is for a static asset (JavaScript, CSS, images, fonts)
- **THEN** the request is served directly from the `dist/` directory without rewriting

### Requirement: Configure rewrites to exclude static patterns
The vercel.json SHALL explicitly exclude common static file extensions and patterns from being rewritten to index.html.

#### Scenario: Static assets bypass rewriting
- **WHEN** request path includes file extensions like `.js`, `.css`, `.svg`, `.json`, `.woff2`, etc.
- **THEN** the request is NOT rewritten and served as a static file

#### Scenario: HTML files are rewritten except index.html
- **WHEN** request is for an HTML file other than index.html
- **THEN** the file is served directly if it exists in dist/, otherwise the request is rewritten to index.html
