# G1 RE-LIFE Wellness Zone — Website

A premium, responsive marketing website built with Next.js 14 (App Router),
TypeScript, Tailwind CSS, and Framer Motion, using the real business content
from the official G1 RE-LIFE Wellness Zone page.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. The build requires internet access on first run
so Next.js can fetch the Google Fonts (Fraunces + Inter) used in
`src/app/layout.tsx` — this is normal `next/font/google` behavior.

```bash
npm run build
npm start
```

## What's inside

- **Content**: all business facts (coach name, phone, email, address,
  services, gallery, social links) live in `src/data/wellness.ts`, sourced
  from https://mybusinessweb.in/G1-RE-LIFE-wellness-zone. Update that one
  file to change site copy.
- **Images**: gallery/service photos are referenced directly from the
  original hosted URLs (allowed via `next.config.mjs` `remotePatterns`) so
  no content was invented. Swap in your own hosted images there whenever
  you're ready.
- **Forms**: `/api/inquiry` and `/api/newsletter` are stubbed API routes
  that validate input with Zod and log submissions to the server console.
  Wire them up to your email provider (e.g. Resend), CRM, or database — see
  the `TODO` comments in each route file.
- **BMI calculator**: a fully client-side interactive widget
  (`src/components/BMICalculator.tsx`) — no data leaves the browser.
- **Accessibility**: skip link, visible focus rings, reduced-motion support,
  alt text throughout, and semantic landmarks.
- **Responsive**: tested from 360px mobile up through 1920px desktop.

## Suggested next steps

1. Connect `/api/inquiry` and `/api/newsletter` to a real email/CRM service.
2. Replace `metadataBase` in `src/app/layout.tsx` with your real production
   domain once deployed.
3. Add a real `favicon.ico` to `src/app/`.
4. Consider hosting your own copies of the images instead of hot-linking to
   `mybusinessweb.in`.
