import type { Metadata } from "next";
import Author from "@/src/views/Author";
import { fetchAuthorMeta } from "@/lib/fetchMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; locale: string }>;
}): Promise<Metadata> {
  const { username, locale } = await params;
  const rawUsername = decodeURIComponent(username).replace(/^@+/, "");
  const user = await fetchAuthorMeta(rawUsername);

  if (!user) return { title: `@${rawUsername} | Falakey` };

  const displayName = user.display_name || `@${rawUsername}`;
  const title = `${displayName} (@${rawUsername})`;
  const description =
    user.bio || `View ${displayName}'s profile and portfolio on Falakey.`;
  const image = user.avatar;
  const resolvedLocale = locale === "ar" ? "ar_AR" : "en_US";

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      siteName: "Falakey",
      locale: resolvedLocale,
      ...(image && {
        images: [{ url: image, width: 400, height: 400, alt: displayName }],
      }),
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@falakey",
      ...(image && { images: [image] }),
    },
  };
}

export default Author;
