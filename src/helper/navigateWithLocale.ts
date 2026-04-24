"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";

export const useNavigateWithLocale = () => {
  const router = useRouter();
  const locale = useSelector((state: RootState) => state.translation.local);

  return (to: string, options?: { replace?: boolean; state?: any }) => {
    const path = `/${locale}${to.startsWith("/") ? to : `/${to}`}`;
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    if (options?.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
  };
};
