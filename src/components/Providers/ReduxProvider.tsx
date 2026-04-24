"use client";
import { useEffect, useState, useMemo } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { createTheme, ThemeProvider } from "@mui/material";

// Static fallback store — always available on server and client initial render
const ssrStore = configureStore({
  reducer: {
    auth: (
      state = { user: null, isLoggedIn: false, token: null },
      _action: any,
    ) => state,
    search: (
      state = {
        types: "photo",
        placeholder: "",
        search: null,
        filter: {},
        sorting: "popular",
        collection: null,
        author: null,
      },
      _action: any,
    ) => state,
    translation: (state = { local: "ar", dir: "rtl" }, _action: any) => state,
  },
});

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store, setStore] = useState<any>(ssrStore);
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  useEffect(() => {
    // Load the real store with persisted auth/locale state on client only
    import("@/lib/store")
      .then((mod) => {
        const getStore = mod.default;
        const s = getStore();
        setStore(s);
        setDir(s.getState().translation.dir as "rtl" | "ltr");
      })
      .catch(() => {
        // Keep ssrStore on failure
      });
  }, []);

  const theme = useMemo(() => createTheme({ direction: dir }), [dir]);

  return (
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </Provider>
    </HelmetProvider>
  );
}
