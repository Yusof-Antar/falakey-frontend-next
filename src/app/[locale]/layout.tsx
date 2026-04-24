"use client";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useTrans } from "@/utils/translation";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use the translation hook which handles Redux context issues
  const { dir } = useTrans();

  return (
    <div
      dir={dir}
      className="relative flex flex-col justify-between h-screen w-full"
    >
      <Navbar />
      <div className="bg-white flex-1 pt-[70px]">{children}</div>
      {/* <Footer /> */}
    </div>
  );
}
