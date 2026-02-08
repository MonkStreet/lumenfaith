# Lumen — Catholic Spiritual Companion

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Daily Gospel RSS (production)

The **Evangelio del Día** section fetches readings from ACI Prensa (ES) and USCCB (EN). Those feeds block direct browser requests (CORS/403). The app uses a **serverless proxy** so requests go to your own domain.

- Deploy the `api/` folder with Vercel (or similar). The `api/gospel.js` function is a GET proxy: `?url=<encoded-rss-url>`.
- In production the app already points to `https://www.lumenfaith.app/api/gospel?url=`. After deploy, the Gospel section will load without 403.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
