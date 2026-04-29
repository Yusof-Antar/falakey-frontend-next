"use client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/types/RootState";

// Since all files that use these are "use client", there's no SSR risk.
// These are thin wrappers kept for import compatibility.

export const useSafeSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

export const useSafeAuth = () =>
  useSelector((state: RootState) => state.auth);

export const useSafeTranslation = () =>
  useSelector((state: RootState) => state.translation);

export { useSelector, useDispatch };
export type { RootState };
