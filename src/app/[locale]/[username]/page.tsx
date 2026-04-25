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
  const user = await fetchAuthorMeta(rawUsername, locale);

  const fallbackImage = "/icons/star-icon.svg";

  if (!user) {
    return {
      title: `@${rawUsername}`,
      openGraph: { images: [{ url: fallbackImage }] },
      twitter: { card: "summary", images: [fallbackImage] },
    };
  }

  const displayName = user.display_name || `@${rawUsername}`;
  const title = `${displayName} (@${rawUsername})`;
  const description =
    user.bio || `View ${displayName}'s profile and portfolio on Falakey.`;
  const image = user.avatar || fallbackImage;

  return {
    title,
    description,
    openGraph: {
      type: "profile",
      title,
      description,
      siteName: "Falakey",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: image, width: 400, height: 400, alt: displayName }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      site: "@falakey",
      images: [image],
    },
  };
}

export default Author;
