export type Locale = 'en' | 'pl' | 'uk';

const translations = {
  en: {
    title: 'Polka.Search',
    description: 'Find local businesses and events near you.',
    searchLabel: 'Search',
    searchPlaceholder: 'Search for businesses, events, tags…',
    latitude: 'Latitude',
    longitude: 'Longitude',
    radius: 'Radius (km)',
    searchButton: 'Search',
    resultsFound: (n: number) => `${n} result${n !== 1 ? 's' : ''} found`,
    distance: 'Distance:',
    starts: 'Starts:',
    latestUpdates: 'Latest Business Updates',
    updateTypes: { deal: 'DEAL', event: 'EVENT', news: 'NEWS' },
    posted: (t: string) => `Posted at ${t}`,
  },
  pl: {
    title: 'Polka.Search',
    description: 'Znajdź lokalne firmy i wydarzenia w pobliżu.',
    searchLabel: 'Szukaj',
    searchPlaceholder: 'Szukaj firm, wydarzeń, tagów…',
    latitude: 'Szerokość geogr.',
    longitude: 'Długość geogr.',
    radius: 'Promień (km)',
    searchButton: 'Szukaj',
    resultsFound: (n: number) => `Znaleziono ${n} wynik${n === 1 ? '' : n < 5 ? 'i' : 'ów'}`,
    distance: 'Odległość:',
    starts: 'Rozpoczyna się:',
    latestUpdates: 'Najnowsze aktualizacje',
    updateTypes: { deal: 'OFERTA', event: 'WYDARZENIE', news: 'NOWOŚĆ' },
    posted: (t: string) => `Opublikowano o ${t}`,
  },
  uk: {
    title: 'Polka.Search',
    description: 'Знайдіть місцеві компанії та події поблизу.',
    searchLabel: 'Пошук',
    searchPlaceholder: 'Шукати компанії, події, теги…',
    latitude: 'Широта',
    longitude: 'Довгота',
    radius: 'Радіус (км)',
    searchButton: 'Шукати',
    resultsFound: (n: number) => `Знайдено ${n} результат${n === 1 ? '' : 'ів'}`,
    distance: 'Відстань:',
    starts: 'Починається:',
    latestUpdates: 'Останні оновлення',
    updateTypes: { deal: 'ЗНИЖКА', event: 'ПОДІЯ', news: 'НОВИНА' },
    posted: (t: string) => `Опубліковано о ${t}`,
  },
} as const;

export type Translations = (typeof translations)[keyof typeof translations];

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.en;
}
