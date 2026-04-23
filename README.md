# Web React

Frontend untuk project Jimun, dibangun dengan stack modern React.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router DOM 7
- TanStack Query + TanStack Form
- Axios
- Zustand
- Base UI + shadcn/ui + Lucide React
- ESLint 9
- pnpm

## Auth

- `web-react` memakai Better Auth client ke backend via `VITE_API_BASE_URL`.
- Google OAuth diproses oleh backend Better Auth, jadi env Google tetap disimpan di `backend/.env`.
- Untuk local dev, set `VITE_API_BASE_URL` ke nilai yang sama dengan `BETTER_AUTH_URL_DEVELOPMENT` backend, biasanya `http://localhost:3000`.
