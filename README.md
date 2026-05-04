# Portfolio

Personal portfolio site built with Next.js App Router, React, TypeScript, Tailwind CSS v4, `next-intl`, and Framer Motion.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS v4
- `next-intl` for localization (`en`, `da`)
- Framer Motion for subtle interaction and transitions

## Local Development

Prerequisites:
- Node.js 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Localization

- Locale routing is configured in `src/i18n/routing.ts`
- Supported locales: `da`, `en`
- Default locale: `en`
- Messages are stored in:
  - `messages/en.json`
  - `messages/da.json`

## Customize Content

Main places to edit:

- `src/lib/site.ts` - name, headline, links, basic profile metadata
- `src/lib/projects.ts` - project data (titles, links, tags, icons, gradients)
- `messages/en.json` and `messages/da.json` - page copy/translations

## Images & Public Assets

- Store static assets in `public/`
- Project and avatar assets currently use `.avif` paths

## Security Headers

Custom headers are configured in `next.config.ts`:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` for restricted browser capabilities
