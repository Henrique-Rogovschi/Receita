// Reconhece links do YouTube (vídeos, shorts, youtu.be) e do Instagram (posts e reels)
export function parseVideo(raw) {
  if (!raw) return null;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.)/, "");

  if (host === "youtu.be") return youtube(u.pathname.slice(1).split("/")[0]);
  if (host.endsWith("youtube.com")) {
    if (u.searchParams.get("v")) return youtube(u.searchParams.get("v"));
    const m = u.pathname.match(/^\/(shorts|embed|live)\/([^/?#]+)/);
    if (m) return youtube(m[2], m[1] === "shorts");
  }
  if (host.endsWith("instagram.com")) {
    const m = u.pathname.match(/^\/(?:[^/]+\/)?(p|reel|reels|tv)\/([^/?#]+)/);
    if (m) {
      const kind = m[1] === "reels" ? "reel" : m[1];
      const base = `https://www.instagram.com/${kind}/${m[2]}/`;
      return { platform: "instagram", id: m[2], url: base, embedUrl: `${base}embed`, thumbnail: null, vertical: true };
    }
  }
  return null;
}

function youtube(id, vertical = false) {
  if (!id) return null;
  return {
    platform: "youtube",
    id,
    url: vertical ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    vertical,
  };
}
