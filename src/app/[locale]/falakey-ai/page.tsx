import type { Metadata } from "next";
import AiGallery from "@/src/views/AiGallery";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Falakey AI | معرض الذكاء الاصطناعي",
  description:
    "استعرض صور مولَّدة بالذكاء الاصطناعي من مجتمع فلكي الإبداعي. Browse AI-generated images created by the Falakey creative community.",
  openGraph: {
    type: "website",
    title: "Falakey AI | معرض الذكاء الاصطناعي",
    description:
      "استعرض صور مولَّدة بالذكاء الاصطناعي من مجتمع فلكي الإبداعي.",
    siteName: "Falakey",
    images: [
      {
        url: "/images/ai-banner.png",
        width: 1200,
        height: 630,
        alt: "Falakey AI Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Falakey AI | معرض الذكاء الاصطناعي",
    description:
      "استعرض صور مولَّدة بالذكاء الاصطناعي من مجتمع فلكي الإبداعي.",
    site: "@falakey",
    images: ["/images/ai-banner.png"],
  },
};

export default AiGallery;
