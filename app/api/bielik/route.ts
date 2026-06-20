import { NextRequest } from 'next/server';

const BIELIK_URL  = process.env.BIELIK_API_URL  ?? 'https://api.bielik.ai/v1/chat/completions';
const BIELIK_KEY  = process.env.BIELIK_API_KEY;
const BIELIK_MODEL = process.env.BIELIK_MODEL ?? 'bielik-11b-v2.3-instruct';

export async function POST(req: NextRequest) {
  const { query, lat, lon, locationLabel } = await req.json();

  if (!BIELIK_KEY) {
    return new Response(
      JSON.stringify({ error: 'Brak klucza BIELIK_API_KEY w .env.local' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const system = `Jesteś lokalnym przewodnikiem po Warszawie. Użytkownik jest w pobliżu: ${locationLabel} (${lat}, ${lon}).
Odpowiadaj krótko (max 3 zdania), po polsku. Podawaj konkretne rekomendacje miejsc z okolicy jeśli pytanie dotyczy lokalizacji. Nie wymyślaj adresów.`;

  const res = await fetch(BIELIK_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${BIELIK_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: BIELIK_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user',   content: query },
      ],
      max_tokens: 300,
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return new Response(JSON.stringify({ error: err }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Stream the response directly to the client
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
