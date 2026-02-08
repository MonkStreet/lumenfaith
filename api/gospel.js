/**
 * Serverless proxy for Daily Gospel RSS feeds.
 * Deploy with Vercel (or similar) so your app can fetch ACI Prensa / USCCB without CORS/403.
 *
 * Usage: GET /api/gospel?url=https%3A%2F%2Fwww.aciprensa.com%2Frss%2Fevangelio
 * Then set in App.jsx: GOSPEL_PROXY_BASE: "https://www.lumenfaith.app/api/gospel?url="
 */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end();
  }
  const url = req.query.url;
  const allowed = [
    "https://www.aciprensa.com/rss/evangelio",
    "https://bible.usccb.org/readings.rss",
  ];
  if (!url || !allowed.some((base) => url.startsWith(base))) {
    return res.status(400).json({ error: "Invalid or disallowed url" });
  }
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "LumenFaith/1.0 (https://www.lumenfaith.app)" },
    });
    if (!response.ok) {
      return res.status(response.status).end();
    }
    const xml = await response.text();
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(xml);
  } catch (e) {
    return res.status(502).end();
  }
}
