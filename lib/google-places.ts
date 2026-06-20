const KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function fetchPlacePhoto(
  name: string,
  lat: number,
  lon: number,
  maxWidth = 640,
): Promise<string | null> {
  if (!KEY) return null;

  try {
    // 1. Find place by name near the coordinates
    const findUrl = new URL('https://maps.googleapis.com/maps/api/place/findplacefromtext/json');
    findUrl.searchParams.set('input', name);
    findUrl.searchParams.set('inputtype', 'textquery');
    findUrl.searchParams.set('locationbias', `point:${lat},${lon}`);
    findUrl.searchParams.set('fields', 'photos');
    findUrl.searchParams.set('key', KEY);

    const findRes = await fetch(findUrl.toString(), { next: { revalidate: 86400 } });
    if (!findRes.ok) return null;
    const findData = await findRes.json();

    const photoRef: string | undefined =
      findData.candidates?.[0]?.photos?.[0]?.photo_reference;
    if (!photoRef) return null;

    // 2. Return the photo URL (direct redirect, no extra request needed)
    const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
    photoUrl.searchParams.set('maxwidth', String(maxWidth));
    photoUrl.searchParams.set('photo_reference', photoRef);
    photoUrl.searchParams.set('key', KEY);

    return photoUrl.toString();
  } catch {
    return null;
  }
}
