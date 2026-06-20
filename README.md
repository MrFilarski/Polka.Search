# Polka.Search

Lokalny agregator miejsc, wydarzeń i zniżek. Wpisz dowolny adres lub użyj GPS — aplikacja pokazuje co jest w pobliżu: restauracje, kawiarnie, bary, muzea, eventy i aktualne promocje.

## Stack

- **Next.js 16** (App Router, SSR + client components)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **OpenStreetMap / Nominatim** — dane o lokalach (bez klucza API)
- **Wikipedia Geosearch** — zabytki i ciekawe miejsca z miniaturkami
- **Bielik AI** — polski model językowy, odpowiada na pytania o okolicę
- **Google Places Photos** — zdjęcia lokali (opcjonalnie)
- **Ticketmaster** — wydarzenia na żywo (opcjonalnie)

## Uruchomienie

```bash
npm install
npm run dev
```

Aplikacja działa bez żadnych kluczy API. Zmień domyślną lokalizację w `app/api/search/route.ts`.

## Opcjonalne klucze API

Skopiuj `.env.local.example` do `.env.local` i uzupełnij:

| Zmienna | Do czego |
|---|---|
| `BIELIK_API_KEY` | Odpowiedzi AI po polsku (bielik.ai) |
| `GOOGLE_PLACES_API_KEY` | Prawdziwe zdjęcia z Google dla każdego miejsca |
| `TICKETMASTER_API_KEY` | Wydarzenia i koncerty w pobliżu |

## Funkcje

- Zakładki kategorii: Odkryj, Jedzenie, Zniżki, Bary, Fitness, Sklepy, Kultura, Eventy
- Wyszukiwarka Bielik AI — pytaj po polsku o miejsca w pobliżu
- Lokalizacja GPS lub ręczny wpis adresu
- Dark / light mode z liquid glass design
- Animowane tło reagujące na kursor
- SSR — pierwsze wyniki ładowane server-side
