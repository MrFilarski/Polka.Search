# Polka.Search

![Polka.Search preview](public/screenshot.png)

**Lokalny agregator miejsc i eventów w Polsce.** Wpisz adres lub użyj GPS — aplikacja pokazuje co jest w pobliżu: restauracje, kawiarnie, bary, muzea, eventy i aktualne promocje. Działa w całości na darmowych API.

🌐 **Live:** https://polka-search.vercel.app &nbsp;·&nbsp; 🔒 **Admin:** https://polka-search.vercel.app/admin

---

## Funkcje

### Wyszukiwanie i lokalizacja
- Wyszukiwarka adresów z geocodingiem — wpisz miasto lub ulicę, wyniki aktualizują się na żywo
- Lokalizacja GPS jednym kliknięciem
- Promień wyszukiwania konfigurowalny przez parametry URL

### Wyniki
- Zakładki kategorii: Odkryj · Jedzenie · Zniżki · Bary · Fitness · Sklepy · Kultura · Eventy
- Dane z OpenStreetMap via Overpass API (prawdziwe miejsca, nie mock)
- Karta hero + lista boczna + siatka kart
- Karta szczegółów miejsca — ocena, godziny, telefon, mapa OSM embedded, udostępnianie
- Filtrowanie wg odległości / oceny / "Otwarte teraz"
- Paginacja ("Załaduj więcej")

### UI i UX
- Dark / light mode (toggle w nawigacji)
- Pasek newsów NA ŻYWO — lokalne wiadomości przeciągane
- Prognoza pogody inline — ikona + temperatura + panel 12h/5 dni
- Animowane tło z cząsteczkami reagującymi na kursor
- Personalizuj — 17 kategorii do włączenia/wyłączenia
- Pełna responsywność mobilna — taby i filtry scrollują się poziomo
- Logo PS na mobile zamiast pełnej nazwy
- Modal opinii/feedbacku

### Konto użytkownika
- Rejestracja i logowanie (localStorage)
- Avatar z inicjałami + kolorowy dot (8 kolorów do wyboru)
- Preferencje kategorii i polubienia zapisywane na koncie
- Demo login (Jan Kowalski)

### PWA
- Manifest.json + service worker (cache-first dla assets, network-first dla API)
- Ikony 192×512 px, możliwość dodania do ekranu głównego

### Admin panel (`/admin`)
- Chroniony hasłem (env `ADMIN_PASSWORD`)
- **Analytics** — 5 kart KPI + wykres odwiedzin 30 dni (Recharts) + popularność zakładek + aktywność godzinowa
- **Miejsca** — tabela wszystkich miejsc OSM z wyszukiwarką, sortowaniem, paginacją, linkami do mapy
- **Użytkownicy** — lista kont z avatarami i preferencjami
- **System** — live health check zewnętrznych API, info deploymentu, stack technologiczny

---

## Stack

| Warstwa | Technologia |
|---|---|
| Framework | **Next.js 16.2.9** — App Router, SSR + client components |
| Język | **TypeScript** strict |
| Style | **Tailwind CSS v4** + custom CSS variables |
| Czcionki | **Inter** (UI) + **JetBrains Mono** (liczby, kod, metryki) |
| Miejsca | **Overpass API** (OpenStreetMap) — darmowe, bez klucza |
| Geocoding | **Nominatim** — darmowe, bez klucza |
| Pogoda | **Open-Meteo** — darmowe, bez klucza |
| Encyklopedia | **Wikipedia API** — darmowe, bez klucza |
| Newsy | **Google News RSS** — darmowe, bez klucza |
| Wykresy | **Recharts** |
| Deploy | **Vercel** |

---

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Utwórz `.env.local` dla panelu admina:

```env
ADMIN_PASSWORD=twoje_haslo
```

Aplikacja działa bez żadnych kluczy API poza `ADMIN_PASSWORD`.

## Deploy

```bash
vercel --prod
```

Projekt skonfigurowany na Vercelu jako `mrfilarskis-projects/polka-search`.

---

## Struktura projektu

```
app/
  globals.css              # wszystkie style głównej apki + CSS variables
  admin.css                # style panelu admina
  layout.tsx               # Inter + JetBrains Mono, PWA metadata
  page.tsx                 # SSR entry point (Overpass + Wikipedia + Ticketmaster)
  admin/
    layout.tsx             # sidebar admina + auth guard
    analytics/page.tsx
    places/page.tsx
    users/page.tsx
    system/page.tsx
  api/
    search/route.ts        # wyszukiwanie miejsc (Overpass API)
    news/route.ts          # Google News RSS parser
    admin/stats/route.ts   # dane dla panelu admina
    bielik/route.ts        # Bielik AI (wymaga klucza)
components/
  SearchPage.tsx           # główny komponent aplikacji
  DetailModal.tsx          # modal szczegółów miejsca
  AiSearchBar.tsx          # pasek wyszukiwania z geocodingiem
  AuthModal.tsx            # rejestracja / logowanie
  UserMenu.tsx             # dropdown użytkownika z avatarem i color pickerem
  NewsTicker.tsx           # pasek newsów NA ŻYWO
  FeedbackModal.tsx        # modal opinii
  PolkaDotBackground.tsx   # animowane tło canvas
  ServiceWorkerRegister.tsx
  admin/
    AdminStats.tsx         # wykresy Recharts
    AdminPlaces.tsx        # tabela miejsc
    AdminUsers.tsx         # tabela użytkowników
    AdminSystem.tsx        # status API i deployment
lib/
  overpass.ts              # zapytania Overpass QL do OSM
  nominatim.ts             # geocoding adresów
  wikipedia.ts             # Wikipedia API
  ticketmaster.ts          # eventy (wymaga klucza)
  images.ts                # Unsplash placeholdery wg kategorii
  types.ts                 # TypeScript interfaces
public/
  favicon.svg              # logo P·S z czerwoną kropką
  manifest.json            # PWA manifest
  sw.js                    # service worker
  icon-192.png
  icon-512.png
```

---

## Opcjonalne klucze API

| Zmienna | Do czego |
|---|---|
| `ADMIN_PASSWORD` | Dostęp do panelu `/admin` |
| `BIELIK_API_KEY` | Odpowiedzi AI po polsku (bielik.ai) — endpoint gotowy |
| `TICKETMASTER_API_KEY` | Eventy (Ticketmaster) — integracja gotowa |
| `GOOGLE_PLACES_API_KEY` | Zdjęcia miejsc (Google Places) — integracja gotowa |

---

## Roadmap

- [ ] Supabase — backend auth (zamiast localStorage) i baza danych
- [ ] Wikimedia Commons — prawdziwe zdjęcia miejsc po nazwie/lokalizacji
- [ ] Ticketmaster API key — prawdziwe eventy w Warszawie
- [ ] Bielik AI — inteligentna wyszukiwarka po polsku
- [ ] Backend feedbacku — Resend / Supabase
- [ ] Prawdziwe godziny otwarcia z tagu `opening_hours` OSM
- [ ] Komentarze i recenzje użytkowników
