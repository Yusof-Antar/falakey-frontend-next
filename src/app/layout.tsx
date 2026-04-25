import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/Providers/ReduxProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// VERCEL_URL is auto-set by Vercel on every deployment (no https://)
// NEXT_PUBLIC_SITE_URL can be set manually for custom domains
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://falakey.com");

const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/star-icon.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Falakey | إبداع رقمي عربي",
    template: "%s | Falakey",
  },
  description:
    "اكتشف صورًا مجانية عالية الجودة وتحديات إبداعية في التصوير الفوتوغرافي. Discover free high-quality stock photos, vectors, and creative photography challenges.",
  keywords: [
    "falakey",
    "فلكي",
    "free photos",
    "صور مجانية",
    "stock images",
    "Arab creativity",
    "إبداع عربي",
    "photography challenges",
    "vectors",
  ],
  openGraph: {
    type: "website",
    siteName: "Falakey",
    title: "Falakey | إبداع رقمي عربي",
    description:
      "اكتشف صورًا مجانية عالية الجودة وتحديات إبداعية في التصوير الفوتوغرافي.",
    images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512, alt: "Falakey" }],
    locale: "ar_AR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@falakey",
    title: "Falakey | إبداع رقمي عربي",
    description:
      "اكتشف صورًا مجانية عالية الجودة وتحديات إبداعية في التصوير الفوتوغرافي.",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: "/star-icon.svg",
    shortcut: "/star-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
