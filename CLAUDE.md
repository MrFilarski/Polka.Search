@AGENTS.md

# Polka.Search — projekt

## Stack
- **Next.js 16.2.9** App Router, TypeScript strict, Tailwind CSS v4
- **Port lokalny:** 3000
- **Deploy:** Vercel (`mrfilarskis-projects/polka-search`)
- **Live:** https://polka-search.vercel.app
- **Admin:** https://polka-search.vercel.app/admin (env: `ADMIN_PASSWORD`)
- **Branch roboczy:** `develop` → PR → `main`

## Struktura stylów
- `app/globals.css` — wszystkie style głównej apki + CSS custom properties
- `app/admin.css` — style panelu admina
- **Nigdy nie hardcoduj kolorów** — zawsze `var(--accent)`, `var(--bg)`, `var(--text)` itd.
- Font UI: `var(--font-inter)` | Font monospace (liczby, metryki, timestamps): `var(--font-mono)` (JetBrains Mono)
- Dark mode domyślny; light mode przez klasę `.light-theme` na `<html>`
- Admin zawsze dark + `--accent: #e8003d` (nadpisane lokalnie w `.admin-shell`)

## CSS variables — kluczowe tokeny
```
--bg, --bg2, --bg3       tła
--text, --text2          tekst
--accent, --accent2      kolor akcentu (biały w dark, czerwony #e8003d w light i admin)
--border                 obramowania
--glass-bg, --glass-border, --glass-blur   glass morphism
--card-radius: 12px
--nav-h: 52px
--font-inter, --font-mono
```

## Admin panel
- Ścieżka: `/admin/*` (analytics, places, users, system)
- Auth: `sessionStorage.getItem('admin_authed') === '1'` + `sessionStorage.getItem('admin_pw')`
- API: `/api/admin/stats` wymaga nagłówka `x-admin-password`
- `components/admin/adminFetch.ts` — helper który dodaje nagłówek automatycznie

## Auth użytkowników
- localStorage: `ps_users` (lista kont), `ps_current_user` (aktywne)
- Komponenty: `AuthModal.tsx` (rejestracja/login), `UserMenu.tsx` (dropdown z avatarem)

## Częste pułapki
- **`.next` cache** — po zmianie CSS czasem trzeba `rm -rf .next` i restart serwera; stary chunk CSS jest serwowany mimo zmian w pliku
- **Hydratacja** — nigdy `useState(new Date())` ani `useState(Math.random())` — różnica SSR/client powoduje podwójny render. Inicjalizuj jako `null`, ustaw w `useEffect`
- **`redirect()` w Server Component** — powoduje błąd Performance API w Next.js 16. Używaj `useRouter().replace()` w client component
- **Recharts** wymaga `react-is` jako peer dep — jeśli brakuje: `npm install react-is --legacy-peer-deps`

## Konwencje
- Komentarze tylko gdy WHY jest nieoczywisty — nie opisuj co kod robi
- Brak error handling dla scenariuszy które nie mogą zajść
- CSS klasy w `globals.css` lub `admin.css`, nie CSS modules
- Tailwind tylko do jednorazowych spacingów/layoutów — złożone komponenty w CSS
