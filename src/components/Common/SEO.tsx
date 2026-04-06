'use client';
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { usePathname } from "next/navigation";

const localizedContent = {
  en: {
    title: "Falakey | Arab Digital Creativity",
    description: "Discover free high-quality stock photos and creative photography challenges.",
    image: "/icons/star-icon.svg",
    keywords: "free photos, stock images, vectors, Arab digital creativity, photography challenges, Falakey, download photos",
  },
  ar: {
    title: "فلكي | إبداع رقمي عربي",
    description: "اكتشف صورًا مجانية عالية الجودة وتحديات إبداعية في التصوير الفوتوغرافي.",
    image: "/icons/star-icon.svg",
    keywords: "صور مجانية, فيكتور, تصوير إبداعي, منصة عربية, فلكي, تحميل صور, تصميم عربي",
  },
};

export type SEOPROPS = {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  keywords?: string;
};

export default function SEO({ title, description, name, type, image, keywords }: SEOPROPS) {
  const { local: locale, dir } = useSelector((state: RootState) => state.translation);
  const pathname = usePathname();

  const content = localizedContent[locale as "en" | "ar"] || localizedContent.en;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const resolvedTitle = title || content.title;
  const resolvedDescription = description || content.description;
  const resolvedKeywords = keywords || content.keywords;
  const resolvedImage = `${origin}${image || content.image}`;
  const canonicalUrl = `${origin}${pathname}`;
  const enUrl = `${origin}/en${pathname}`;
  const arUrl = `${origin}/ar${pathname}`;

  return (
    <Helmet htmlAttributes={{ lang: locale, dir }}>
      <title>{resolvedTitle}</title>
      <link rel="icon" type="image/svg+xml" href="/star-icon.svg" />
      <meta name="description" content={resolvedDescription} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta property="og:type" content={type || "website"} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={locale === "ar" ? "ar_AR" : "en_US"} />
      <meta property="og:site_name" content="Falakey" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:site" content={name || "@falakey"} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="ar" href={arUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
