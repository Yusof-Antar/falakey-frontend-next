'use client';
import Navbar from "@/components/Layout/Navbar";
import SideBar from "@/components/Layout/SideBar";
import DashboardFooter from "@/components/Layout/DashboardFooter";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { dir } = useSelector((state: RootState) => state.translation);
  return (
    <div dir={dir} className="relative flex flex-col items-center justify-between h-screen">
      <Navbar />
      <SideBar />
      <div className="max-w-[1400px] h-screen bg-white w-[95%] lg:pb-0 pb-[70px] lg:pt-[80px] flex flex-col justify-between items-center gap-4">
        {children}
        <DashboardFooter />
      </div>
    </div>
  );
}
