
# LaunchTwin

AI launch copilot for indie mobile app founders.

## Live Demo

- HackOnVibe deployment: https://2026-07-0xalgo.hackonvibe.com
- Original deployment: https://launch-twin.vercel.app

## Problem

Solo mobile app builders struggle to promote launches effectively because:

- They write from founder perspective, not user perspective.
- They publish generic copy across channels with low engagement.
- They do not have time or budget for structured launch planning.

Result: weak early traction despite good products.

## Solution

LaunchTwin runs a 5-step pipeline in one flow:

1. Persona generation: creates one specific target user profile.
2. Discovery simulation: generates 3 realistic scenes of how that user discovers the app.
3. Channel content kit: writes launch content for Reddit, Product Hunt, X/Twitter, and short video.
4. Critique loop: scores each channel output for authenticity and conversion potential, with fix suggestions.
5. Zero-budget plan: outputs a 7-day launch calendar plus first-user actions.

Outputs are stream-rendered in the UI and exportable as a single markdown campaign.

## Impact

For target users (solo/indie app founders), LaunchTwin reduces launch planning from hours to minutes and improves quality by forcing persona-grounded messaging.

Business impact direction:

- Better first-week activation from more relevant channel copy.
- Faster iteration via regenerate + critique + apply-fix loop.
- Clear freemium path: free limited runs, paid unlimited campaigns/history/team features.

## Stack

- Frontend: React, Vite, Tailwind, Framer Motion
- API proxy: Express + Groq (from original Vercel deployment)

## Run locally

```bash
npm install
cp .env.example .env
# add GROQ_API_KEY in .env
npm run dev
```

## HackOnVibe notes

- This team repo deploys to Cloudflare Pages via push to `main`.
- CI/CD test marker is in `index.html` to verify deploy updates.
- On HackOnVibe domain, API calls default to `https://launch-twin.vercel.app/api` to keep generation working on static hosting.
- Presentation files (bot-checked): `questionnaire.md` and `video_link.md` in repo root.
- Demo video URL also mirrored at `docs/assets/demo-video-link.txt`.
- Vercel must deploy the Express API (`api/index.js` + `vercel.json` rewrites). Set `GROQ_API_KEY` in Vercel → Settings → Environment Variables.
- Do not commit real API keys.
