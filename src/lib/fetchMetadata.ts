const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://admin.falakey.com/api/v1/";

export async function fetchPostMeta(slug: string, locale = "ar") {
  try {
    const res = await fetch(
      `${BASE_URL}posts/show/${slug}?locale=${locale}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchChallengeMeta(slug: string, locale = "ar") {
  try {
    const res = await fetch(
      `${BASE_URL}challenges/show/${slug}?locale=${locale}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export async function fetchAuthorMeta(username: string, locale = "ar") {
  try {
    const res = await fetch(
      `${BASE_URL}users/${username}/profile/public?locale=${locale}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}
