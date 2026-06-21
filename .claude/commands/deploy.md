Wykonaj pełny deploy na produkcję:

1. Sprawdź `git status` i `git diff --stat` — wylistuj zmienione pliki
2. Uruchom `npm run build` (PowerShell: `PowerShell -Command "npm run build 2>&1"`) — jeśli błędy TypeScript lub build, zatrzymaj się i napraw
3. Zrób `git add` dla zmienionych plików (nie używaj `git add -A` — dodaj konkretne pliki)
4. Zaproponuj wiadomość commita opisującą zmiany, poczekaj na akceptację, potem `git commit`
5. `git push origin develop`
6. `vercel --prod --yes`
7. Potwierdź status deployu i podaj URL

Jeśli nie ma co commitować (czyste working tree), pomiń kroki 3-5 i od razu deploy.
