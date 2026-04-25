const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://admin.falakey.com/api/v1/";

async function fetchJSON(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchPostMeta(slug: string, locale = "ar") {
  // Try the requested locale first, fall back to the other if data is empty
  let data = await fetchJSON(
    `${BASE_URL}posts/show/${slug}?locale=${locale}`,
  );
  if (!data?.title) {
    const other = locale === "ar" ? "en" : "ar";
    data = await fetchJSON(`${BASE_URL}posts/show/${slug}?locale=${other}`);
  }
  return data ?? null;
}

export async function fetchChallengeMeta(slug: string, locale = "ar") {
  let data = await fetchJSON(
    `${BASE_URL}challenges/show/${slug}?locale=${locale}`,
  );
  if (!data?.title) {
    const other = locale === "ar" ? "en" : "ar";
    data = await fetchJSON(
      `${BASE_URL}challenges/show/${slug}?locale=${other}`,
    );
  }
  return data ?? null;
}

export async function fetchAuthorMeta(username: string, locale = "ar") {
  let data = await fetchJSON(
    `${BASE_URL}users/${username}/profile/public?locale=${locale}`,
  );
  if (!data?.display_name) {
    const other = locale === "ar" ? "en" : "ar";
    data = await fetchJSON(
      `${BASE_URL}users/${username}/profile/public?locale=${other}`,
    );
  }
  return data ?? null;
}

/** Pick the best OG image from a post — prefers sm (smaller file, faster scraper) */
export function pickPostImage(post: any): string | null {
  return (
    post?.media?.sm ||
    post?.preview_links?.sm ||
    post?.media?.thumb ||
    post?.preview_links?.thumb ||
    post?.media?.md ||
    post?.preview_links?.md ||
    post?.media?.original ||
    null
  );
}

/** Pick the best OG image from a challenge */
export function pickChallengeImage(challenge: any): string | null {
  const m = challenge?.media?.[0];
  return m?.sm || m?.thumb || m?.original || null;
}
