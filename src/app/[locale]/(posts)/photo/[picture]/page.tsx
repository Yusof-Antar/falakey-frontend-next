import type { Metadata } from "next";
import PictureDetail from "@/src/views/PictureDetail";
import { fetchPostMeta } from "@/lib/fetchMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ picture: string; locale: string }>;
}): Promise<Metadata> {
  const { picture, locale } = await params;
  const post = await fetchPostMeta(picture, locale);

  const fallbackImage = "/icons/star-icon.svg";

  if (!post) {
    return {
      title: "Photo",
      openGraph: { images: [{ url: fallbackImage }] },
      twitter: { card: "summary_large_image", images: [fallbackImage] },
    };
  }

  const title = post.title || "Photo";
  const description =
    post.description ||
    post.short_description ||
    "Discover this photo on Falakey — free high-quality stock images.";
  const image =
    post.preview_links?.md ||
    post.preview_links?.sm ||
    post.preview_links?.thumb ||
    fallbackImage;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      siteName: "Falakey",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
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

export default PictureDetail;
