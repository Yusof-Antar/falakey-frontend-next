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
  const post = await fetchPostMeta(picture);

  if (!post) return { title: "Video | Falakey" };

  const title = post.title || "Video";
  const description =
    post.description ||
    post.short_description ||
    "Watch this video on Falakey — free high-quality creative content.";
  const image =
    post.thumbnails?.thumb ||
    post.preview_links?.thumb ||
    post.preview_links?.sm;
  const resolvedLocale = locale === "ar" ? "ar_AR" : "en_US";

  return {
    title,
    description,
    openGraph: {
      type: "video.other",
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

export default PictureDetail;
