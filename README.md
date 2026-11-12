# Drippy Dee Portfolio

Personal portfolio for **Drippy Dee (Daniel Adegoke Akinpelu)** built with React, Vite, Tailwind CSS, Framer Motion, and Lucide Icons. Includes an Express contact API at `/api/contact`.

## Run locally

```bash
npm install
npm run dev
```

- Vite frontend: http://localhost:5173
- Contact API: http://localhost:3001 (proxied via `/api` in dev)

## Build

```bash
npm run build
npm run preview
```

## Contact API

`POST /api/contact` with JSON `{ "name", "email", "message" }` validates input, logs/stores submissions in memory, and returns toast-friendly JSON.
