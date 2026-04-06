'use client';
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  const { dir } = useSelector((state: RootState) => state.translation);
  return (
    <div dir={dir} className="relative flex flex-col justify-between h-screen w-full">
      <Navbar />
      <div className="bg-white flex-1 pt-[70px]">
        {children}
      </div>
      <Footer />
    </div>
  );
}
