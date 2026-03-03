<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d96abe0e-89ba-4055-82fa-a437fd725d0a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build for Production

\\\ash
npm run build
\\\

This creates a \dist/\ directory with all optimized production files.

## Deploy to Vercel

This project is configured for seamless deployment to Vercel:

1. The \ercel.json\ file configures SPA routing - all non-static requests are routed to \index.html\ to enable client-side routing
2. Vite builds output to \dist/\ directory, which Vercel serves as the public root
3. Simply push to GitHub and Vercel will automatically detect and deploy the changes

**SPA Routing Configuration:**
The \ewrites\ rule in \ercel.json\ uses a regex pattern to:
- Route all requests to \/index.html\ for SPA navigation
- Exclude static assets (.js, .css, images, fonts, etc.) from being rewritten
- Allow React Router or other client-side routers to handle navigation

This prevents 404 errors when users navigate directly to nested routes or refresh the page.
