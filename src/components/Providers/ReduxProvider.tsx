'use client';
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { createTheme, ThemeProvider } from "@mui/material";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<any>(null);
  const [dir, setDir] = useState<"rtl" | "ltr">("rtl");

  useEffect(() => {
    // Only import store on client side
    import("@/lib/store").then((mod) => {
      const s = mod.default;
      setStore(s);
      setDir(s.getState().translation.dir as "rtl" | "ltr");
    });
  }, []);

  const theme = createTheme({ direction: dir });

  if (!store) return null;

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
