import type { Metadata } from "next";
import ChallengeDetails from "@/components/Challenge/ChallengeDetails";
import { fetchChallengeMeta, pickChallengeImage } from "@/lib/fetchMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const challenge = await fetchChallengeMeta(slug, locale);

  const fallbackImage = "/icons/star-icon.svg";

  if (!challenge) {
    return {
      title: "Challenge",
      openGraph: { images: [{ url: fallbackImage }] },
      twitter: { card: "summary_large_image", images: [fallbackImage] },
    };
  }

  const title = challenge.title || "Challenge";
  const description =
    challenge.short_description ||
    challenge.description ||
    "Join this creative photography challenge on Falakey.";
  const image = pickChallengeImage(challenge) || fallbackImage;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      siteName: "Falakey",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@falakey",
      images: [image],
    },
  };
}

export default ChallengeDetails;
