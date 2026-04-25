import type { Metadata } from "next";
import ChallengeDetails from "@/components/Challenge/ChallengeDetails";
import { fetchChallengeMeta } from "@/lib/fetchMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const challenge = await fetchChallengeMeta(slug);

  if (!challenge) {
    return { title: "Challenge | Falakey" };
  }

  const title = challenge.title || "Challenge";
  const description =
    challenge.short_description ||
    challenge.description ||
    "Join this creative photography challenge on Falakey.";
  const image =
    challenge.media?.[0]?.original ||
    challenge.media?.[0]?.sm ||
    challenge.media?.[0]?.thumb;
  const resolvedLocale = locale === "ar" ? "ar_AR" : "en_US";

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      siteName: "Falakey",
      locale: resolvedLocale,
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@falakey",
      ...(image && { images: [image] }),
    },
  };
}

export default ChallengeDetails;
