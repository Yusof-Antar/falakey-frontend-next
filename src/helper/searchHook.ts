"use client";
import { useSelector } from "react-redux";
import { useMemo, useEffect } from "react";
import type { RootState } from "@/types/RootState";

export const useSearchParamsHook = () => {
  const searchState = useSelector((state: RootState) => state.search);

  const stringFiltering = useMemo(() => {
    const { types, search, filter, sorting, collection } = searchState;
    const params: Record<string, string> = {};

    if (types) {
      params.types = types;
    } else {
      params.types = "photo";
    }
    if (search) params.search = search;
    if (filter) {
      if (filter.orientation) params.orientation = filter.orientation;
      if (filter.size) params.size = filter.size;
      if (filter.color) params.color = filter.color;
    }
    if (sorting) params.sorting = sorting;
    if (collection) params.collection = collection;

    return new URLSearchParams(params).toString();
  }, [searchState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const currentPath = window.location.pathname;
    const newUrl = `${currentPath}?${stringFiltering}`;
    window.history.pushState(null, "", newUrl);
  }, [stringFiltering]);

  return stringFiltering;
};

export const getEffectiveSearchParams = (state: RootState) => {
  const { types, search, filter, sorting, collection } = state.search;
  return { types, search, filter, sorting, collection };
};
