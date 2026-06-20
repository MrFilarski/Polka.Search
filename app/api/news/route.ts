import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

function stripCdata(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}
function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, '').trim();
}

export async function GET(req: NextRequest) {
  const location = req.nextUrl.searchParams.get('location') ?? 'Warszawa';
  const query = encodeURIComponent(`${location} aktualności`);
  const url = `https://news.google.com/rss/search?q=${query}&hl=pl&gl=PL&ceid=PL:pl`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'PolkaSearch/1.0' },
      next: { revalidate: 300 },
    });
    const xml = await res.text();

    const articles = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
      .slice(0, 8)
      .map(m => {
        const c = m[1];
        const get = (tag: string) => stripCdata(c.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1] ?? '');
        const title = stripTags(get('title'));
        const link  = stripTags(get('link'));
        const pubDate = get('pubDate');
        const source  = stripTags(get('source'));
        const desc    = stripTags(get('description')).slice(0, 180);
        const img     = c.match(/url="([^"]+)"/)?.[1] ?? null;
        return { title, link, pubDate, source, description: desc, image: img };
      })
      .filter(a => a.title);

    return Response.json({ articles });
  } catch {
    return Response.json({ articles: [] });
  }
}
