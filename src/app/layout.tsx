import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/Providers/ReduxProvider";

export const metadata: Metadata = {
  title: "Falakey | Arab Digital Creativity",
  description: "Discover free high-quality stock photos and creative photography challenges.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
