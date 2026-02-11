# CLAUDE.md — Lumen (LumenFaith)

## Project Overview

**Lumen** is a Catholic Spiritual Companion web application — a free, open-source SPA that supports Catholic prayer and spiritual practice. Features include Rosary prayer guides, Daily Examen, Confession preparation, a prayer library, daily Gospel readings (via RSS), and a personal journal with optional cloud sync.

- **Production URL**: https://www.lumenfaith.app
- **Tagline**: "Ad Maiorem Dei Gloriam" (For the Greater Glory of God)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 (JSX, no TypeScript) |
| Build tool | Vite 7 |
| Linter | ESLint 9 (flat config) |
| Styling | Inline CSS-in-JS objects (no CSS framework or files) |
| Fonts | Google Fonts — Cormorant Garamond (headings), Lora (body) |
| Deployment | Vercel (static + serverless functions) |
| Analytics | @vercel/analytics, @vercel/speed-insights |
| Package manager | npm |
| Module system | ES modules (`"type": "module"`) |

## Project Structure

```
lumenfaith/
├── api/
│   └── gospel.js               # Vercel serverless proxy for RSS feeds
├── public/
│   └── vite.svg
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main application (~1100 lines, all views & logic)
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── Footer.jsx          # Footer with auth controls & language switcher
│   └── i18n/
│       ├── LocaleContext.jsx   # React context provider for locale & translations
│       └── translations.js    # All UI strings for en-US and es-ES (~66KB)
├── index.html                  # HTML entry point (PWA/mobile meta tags)
├── package.json
├── vite.config.js              # Vite config with dev proxy for RSS feeds
├── vercel.json                 # Vercel rewrites and cache headers
├── eslint.config.js            # ESLint flat config
└── README.md
```

### Key architectural note

Almost all application logic lives in `src/App.jsx`. Components, views, hooks, styles, and data are defined inline in this single file. Only i18n and the Footer are extracted into separate files.

## Commands

```sh
npm run dev       # Start Vite dev server (localhost:5173) with HMR
npm run build     # Production build to dist/
npm run lint      # Run ESLint on all JS/JSX files
npm run preview   # Preview production build locally
```

## Lint Rules & Code Quality

- ESLint 9 flat config (`eslint.config.js`)
- Extends: `@eslint/js` recommended, `react-hooks` recommended, `react-refresh/vite`
- Custom rule: `no-unused-vars` ignores variables matching `^[A-Z_]` (allows PascalCase component declarations and UPPER_SNAKE_CASE constants)
- Target: ES2020, browser globals, JSX enabled
- Ignores: `dist/`

Always run `npm run lint` before committing to verify no lint errors.

## Architecture & Patterns

### Views / Navigation

Client-side routing via `window.history.pushState()` — no router library. Views are defined in the `VIEWS` constant:

```
home | rosary | rosary_pray | confession | examen | prayers | journal | gospel
```

Navigation is handled by setting view state + pushing browser history. A `popstate` listener handles the browser back button.

### State Management

- React hooks only: `useState`, `useEffect`, `useRef`, `useCallback`, `useMemo`
- Context API via `LocaleContext` for i18n
- Custom hooks: `useAuth()` (Google OAuth), `useJournal(user)` (journal CRUD + sync)
- No Redux, Zustand, or other state library

### Styling

All styles are inline JavaScript objects. Design tokens are centralized in an `S` object inside `App.jsx`:

- **Gold accent**: `#BF9B30`
- **Body text**: `#f5ecd7`
- **Dark background**: `#0d1117`
- **Card background**: `rgba(245,236,215,0.04)`

CSS animations (fadeUp, float, shimmer, crossGlow, spin) are injected via `<style>` tag in a `useEffect`.

### Internationalization (i18n)

- Two locales: `en-US` and `es-ES`
- All strings in `src/i18n/translations.js` (large file, ~66KB)
- `LocaleContext` provides `t(key, params)` function, `locale`, and `setLocale`
- Locale stored in localStorage (`lumen_locale`)
- Document `lang` attribute and `<title>` update on locale change

### Data Persistence

No server-side database. All data uses browser localStorage:

| Key pattern | Contents |
|-------------|----------|
| `lumen_user` | User profile (from Google OAuth) |
| `lumen_journal_${userId}` | Journal entries (JSON) |
| `lumen_gospel_${locale}_${dateKey}` | Cached daily Gospel readings |
| `lumen_locale` | Language preference |

Optional remote sync via n8n webhooks (POST to save, GET to load) configured in `CONFIG` object at top of `App.jsx`.

### Authentication

- Google OAuth 2.0 (Google Identity Services)
- Client ID and webhook URLs are in the `CONFIG` object at top of `App.jsx` (lines 31-37)
- JWT parsed from Google credential response for user profile (sub, name, email, picture)
- Demo mode: if Google auth unavailable, a local "Pilgrim" user is created
- Journal requires authentication; other features work anonymously

### Serverless API

Single Vercel serverless function at `api/gospel.js`:

- `GET /api/gospel?url=<encoded-rss-url>`
- Proxies requests to whitelisted RSS feed URLs (ACI Prensa for Spanish, USCCB for English)
- Returns XML with 1-hour cache header
- Prevents abuse via URL whitelist

In development, Vite proxies `/api/gospel-es` and `/api/gospel-en` directly to the RSS sources.

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HomeScreen`, `RosaryPray`, `DailyExamen` |
| Functions/hooks | camelCase | `useAuth`, `parseGospelRss` |
| Constants | UPPER_SNAKE_CASE | `VIEWS`, `CONFIG`, `GOSPEL_CACHE_PREFIX` |
| Style object | `S` prefix (global) or `styles` (local) | `S.gold`, `styles.text` |
| Files | PascalCase for components, camelCase for utilities | `Footer.jsx`, `translations.js` |

## Deployment

- **Platform**: Vercel
- **SPA routing**: All non-asset paths rewrite to `/index.html` (via `vercel.json`)
- **Cache strategy**: Versioned assets get 1-year immutable cache; HTML uses no-cache
- **Serverless functions**: Auto-deployed from `api/` directory
- **Analytics**: `<Analytics />` and `<SpeedInsights />` components from `@vercel/analytics` and `@vercel/speed-insights`

## Development Workflow

1. `npm install` to install dependencies
2. `npm run dev` to start local dev server
3. Make changes — HMR updates the browser instantly
4. `npm run lint` to check for errors
5. `npm run build` to verify production build succeeds
6. Commit with descriptive messages following existing convention (see below)

## Commit Message Convention

Based on existing history, commits follow this pattern:

- `New: <description>` — for new features
- `Fix: <description>` — for bug fixes and improvements

Examples from history:
```
New: Added Gospel of the day
Fix: Google login button reverted to official
Fix: Make fake page-by-page navigation
New: Added Vercel Speed Insights
```

## Important Considerations for AI Assistants

1. **Single-file architecture**: `App.jsx` contains nearly everything. When adding a new view or feature, add it inline following the existing pattern unless there's a strong reason to extract it.
2. **No TypeScript**: The project uses plain JSX. Do not introduce `.ts` or `.tsx` files.
3. **No CSS files**: All styling is inline objects. Do not create `.css` or `.scss` files.
4. **No router library**: Navigation is manual via `pushState`. Do not add react-router or similar.
5. **Translations**: Any user-facing text must go in `src/i18n/translations.js` for both `en-US` and `es-ES`. Never hardcode visible strings in components.
6. **Configuration**: External URLs, API keys, and webhook endpoints live in the `CONFIG` object at the top of `App.jsx`.
7. **Minimal dependencies**: The project intentionally keeps dependencies minimal. Avoid adding new npm packages unless clearly necessary.
8. **Mobile-first**: Design for mobile screens (max-width ~560px containers). Test with iPhone safe-area considerations.
9. **Accessibility**: Use semantic HTML, `aria-pressed` on toggles, `alt` text on images, proper heading hierarchy.
10. **No test framework**: There are no automated tests configured. Run `npm run lint` and `npm run build` as the primary quality checks.
