"use client";
import type { RootState } from "@/types/RootState";
import { useSelector } from "react-redux";
import rawTranslations from "../assets/translations.json";
import { SupportedLocales, Translations } from "@/types/Translations";

const translations: Translations = rawTranslations;

const getNestedTranslation = (obj: any, path: string): string | null => {
  return path.split(".").reduce((acc, part) => {
    if (acc && acc[part] !== undefined) return acc[part];
    return null;
  }, obj);
};

export const useTrans = () => {
  let local = "ar"; // Default fallback
  let dir = "rtl";

  try {
    const state = useSelector((state: RootState) => state.translation);
    local = state.local;
    dir = state.dir;
  } catch (e) {
    // Redux context not available (SSR), use defaults
  }

  const t = (key: string): string => {
    const value = getNestedTranslation(
      translations[local as SupportedLocales],
      key,
    );
    return value || key;
  };

  return { t, dir, local };
};
