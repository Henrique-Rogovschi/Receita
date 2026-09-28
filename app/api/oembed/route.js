import { NextResponse } from "next/server";

// Busca o título de vídeos do YouTube (o Instagram exige token, então fica de fora)
export async function GET(req) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url || !/youtu(\.be|be\.com)/.test(url)) return NextResponse.json({});
  try {
    const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`);
    if (!r.ok) return NextResponse.json({});
    const d = await r.json();
    return NextResponse.json({ title: d.title, author: d.author_name });
  } catch {
    return NextResponse.json({});
  }
}
