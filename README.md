# Stoep: holiday-home booking demo

A fictional holiday-home booking app with twelve imaginary South African homes. Browse and filter homes, check availability on a calendar, book a stay with a price breakdown (nights × rate, cleaning fee, 15% VAT), then view or cancel it under My trips. It's a static app with no backend. Bookings and favourites are saved in the browser's `localStorage`, and if that data is corrupt or blocked, the app recovers and shows a notice.

All homes, prices and bookings are made up. Every illustration is original SVG drawn in code, so there are no photos and no external assets.

## Stack

- TypeScript, React 18, React Router (hash routing)
- Zod for every data shape (catalogue, stored bookings, forms), React Hook Form with the Zod resolver
- Vite (static build, served under `/apps/stays/`)
- Vitest for the date, availability, pricing, storage and schema logic
- Plain CSS with light and dark themes from the system setting. No CSS framework, no web fonts.

The build runs under a strict Content Security Policy: no inline scripts or styles, `script-src 'self'`, `style-src 'self'`.

## Develop

```sh
npm ci
npm run dev
```

## Test

```sh
npm test
```

## Build

```sh
npm run build
```

The output goes to `dist/`. Serve it from the `/apps/stays/` path.
