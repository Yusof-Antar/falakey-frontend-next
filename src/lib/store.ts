'use client';
import { configureStore } from "@reduxjs/toolkit";
import authSlice, { login, logout } from "./slices/authSlice";
import searchSlice from "./slices/searchSlice";
import transSlice from "./slices/transSlice";
import Cookies from "js-cookie";
import { apiRequest } from "@/utils/apiRequest";

const KNOWN_LOCALES = ["en", "ar"];
const FALLBACK_LOCALE = "ar";

const isClient = typeof window !== "undefined";

const getLocaleFromUrlPath = (): string | null => {
  if (!isClient) return null;
  const segments = window.location.pathname.split("/").filter(Boolean);
  return KNOWN_LOCALES.includes(segments[0]) ? segments[0] : null;
};

const getLocaleFromCookies = (): string => {
  const saved = Cookies.get("locale");
  return KNOWN_LOCALES.includes(saved || "") ? saved! : FALLBACK_LOCALE;
};

const saveLocaleToCookies = (locale: string, dir: string) => {
  if (isClient) localStorage.setItem("locale", locale);
  Cookies.set("locale", locale, { expires: 30 });
  Cookies.set("dir", dir, { expires: 30 });
};

const ensureLocaleInUrl = (newLocale: string) => {
  if (!isClient) return;
  const url = new URL(window.location.href);
  const segs = url.pathname.split("/").filter(Boolean);
  if (KNOWN_LOCALES.includes(segs[0])) segs[0] = newLocale;
  else segs.unshift(newLocale);
  url.pathname = `/${segs.join("/")}`;
  window.history.replaceState({}, "", url.toString());
};

const loadState = () => {
  const authSession = Cookies.get("user");
  const jsonResponse = authSession ? JSON.parse(authSession) : null;
  const authState =
    jsonResponse?.user && jsonResponse?.token
      ? { auth: jsonResponse }
      : { auth: { user: null, isLoggedIn: false, token: null } };

  const savedLocale = getLocaleFromCookies();
  const pathLocale = getLocaleFromUrlPath();
  const finalLocale = pathLocale || savedLocale;
  const finalDir = finalLocale === "ar" ? "rtl" : "ltr";

  if (isClient && pathLocale && pathLocale !== savedLocale) {
    saveLocaleToCookies(pathLocale, finalDir);
  }
  if (isClient) ensureLocaleInUrl(finalLocale);

  return { ...authState, translation: { local: finalLocale, dir: finalDir } };
};

const store = configureStore({
  reducer: { auth: authSlice, search: searchSlice, translation: transSlice },
  preloadedState: isClient ? loadState() : {
    auth: { user: null, isLoggedIn: false, token: null },
    translation: { local: FALLBACK_LOCALE, dir: "rtl" },
  },
});

const saveAuthStateToCookies = (state: RootState) => {
  Cookies.set("user", JSON.stringify(state.auth), { expires: 7 });
};

let currentAuth = store.getState().auth;
let currentLocale = store.getState().translation.local;
let currentDir = store.getState().translation.dir;

store.subscribe(() => {
  const prevAuth = currentAuth;
  const prevLocale = currentLocale;
  const state = store.getState();
  currentAuth = state.auth;
  currentLocale = state.translation.local;
  currentDir = state.translation.dir;
  if (prevAuth !== currentAuth) saveAuthStateToCookies(state);
  if (prevLocale !== currentLocale) {
    saveLocaleToCookies(currentLocale, currentDir);
    ensureLocaleInUrl(currentLocale);
  }
});

const verifyToken = async () => {
  const token = store.getState().auth.token;
  if (!token) return;
  try {
    const result = await apiRequest({ method: "GET", url: "users/profile/private", token });
    if (result["success"]) {
      store.dispatch(login({ user: result["data"]["data"], isLoggedIn: true, token }));
      Cookies.set("user", JSON.stringify({ user: result["data"]["data"], isLoggedIn: true, token }), { expires: 7 });
    } else {
      store.dispatch(logout());
      Cookies.remove("user");
      if (isClient) window.location.href = `/${store.getState().translation.local}`;
    }
  } catch {
    store.dispatch(logout());
    Cookies.remove("user");
    if (isClient) window.location.href = `/${store.getState().translation.local}`;
  }
};

if (isClient) verifyToken();

export type RootState = ReturnType<typeof store.getState>;
export default store;
