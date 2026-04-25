import type { Metadata } from "next";
import dynamicComponent from "next/dynamic";

export const dynamic = "force-dynamic";

const AiChat = dynamicComponent(() => import("@/src/views/AiChat"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Falakey AI Generator | توليد الصور بالذكاء الاصطناعي",
  description:
    "أنشئ صورًا إبداعية بالذكاء الاصطناعي باستخدام أداة توليد الصور من فلكي. Create stunning AI-generated images with Falakey's image generator.",
  openGraph: {
    type: "website",
    title: "Falakey AI Generator | توليد الصور بالذكاء الاصطناعي",
    description:
      "أنشئ صورًا إبداعية بالذكاء الاصطناعي باستخدام أداة توليد الصور من فلكي.",
    siteName: "Falakey",
    images: [
      {
        url: "/images/ai-banner.png",
        width: 1200,
        height: 630,
        alt: "Falakey AI Image Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Falakey AI Generator | توليد الصور بالذكاء الاصطناعي",
    description:
      "أنشئ صورًا إبداعية بالذكاء الاصطناعي باستخدام أداة توليد الصور من فلكي.",
    site: "@falakey",
    images: ["/images/ai-banner.png"],
  },
};

export default AiChat;
