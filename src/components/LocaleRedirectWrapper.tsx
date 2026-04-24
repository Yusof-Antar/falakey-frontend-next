"use client";
import { useEffect } from "react";
import { usePathname, useNavigateWithLocale } from "next/navigation";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "@/types/RootState";

const SUPPORTED_LOCALES = ["en", "ar"];

export default function LocaleRedirectWrapper() {
  const pathname = usePathname();
  const navigate = useNavigateWithLocale();

  const { local: currentLocale } = useSelector(
    (state: RootState) => state.translation,
  );

  const savedLocale =
    typeof window !== "undefined" ? Cookies.get("locale") : undefined;
  const browserLang =
    typeof window !== "undefined" ? navigator.language.split("-")[0] : "ar";
  const defaultLocale =
    savedLocale ||
    (SUPPORTED_LOCALES.includes(browserLang) ? browserLang : "ar");

  const finalLocale = currentLocale || defaultLocale;

  useEffect(() => {
    const pathSegments = pathname.split("/").filter((seg) => seg !== "");
    const hasLocalePrefix =
      pathSegments.length > 0 && SUPPORTED_LOCALES.includes(pathSegments[0]);

    if (!hasLocalePrefix) {
      const newPath = `/${finalLocale}${pathname}`;
      router.replace(newPath);
    }
  }, [pathname, router, finalLocale]);

  return null;
}
