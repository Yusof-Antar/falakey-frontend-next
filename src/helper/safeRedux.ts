"use client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/types/RootState";
import { useEffect, useState } from "react";

// Safe hook to use Redux state that works during SSR
export const useSafeSelector = <T>(selector: (state: RootState) => T): T => {
  try {
    return useSelector(selector);
  } catch (e) {
    // Return undefined during SSR - the component should handle this
    return undefined as unknown as T;
  }
};

// Hook to get auth state safely
export const useSafeAuth = () => {
  const [authState, setAuthState] = useState({
    user: null,
    isLoggedIn: false,
    token: null,
  });

  try {
    const state = useSelector((s: RootState) => s.auth);
    useEffect(() => {
      setAuthState(state);
    }, [state]);
  } catch (e) {
    // SSR - use defaults
  }

  return authState;
};

// Hook to get translation state safely
export const useSafeTranslation = () => {
  const [transState, setTransState] = useState({
    local: "ar",
    dir: "rtl",
  });

  try {
    const state = useSelector((s: RootState) => s.translation);
    useEffect(() => {
      setTransState(state);
    }, [state]);
  } catch (e) {
    // SSR - use defaults
  }

  return transState;
};

// Re-export useSelector and useDispatch for convenience
export { useSelector, useDispatch };
export type { RootState };
