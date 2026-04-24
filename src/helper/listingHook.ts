"use client";
import type { RootState } from "@/types/RootState";
import { Post } from "@/models/post";
import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

interface ListingFilters {
  type?: string;
  status?: string;
}

export const useListingHook = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const pageRef = useRef(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const oldFiltersRef = useRef<ListingFilters | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);
  const { local } = useSelector((state: RootState) => state.translation);

  const getListingPosts = async (filters: ListingFilters = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const filtersChanged =
      !oldFiltersRef.current ||
      JSON.stringify(oldFiltersRef.current) !== JSON.stringify(filters);

    if (filtersChanged) {
      setData([]);
      pageRef.current = 1;
      setHasMore(true);
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.status) params.append("status", filters.status);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}users/posts/all?page=${pageRef.current}&take=10&locale=${local}&${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        },
      );

      if (response.data?.success) {
        const newData: Post[] = response.data.data;

        setData((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const filtered = newData.filter((p) => !existingIds.has(p.id));
          return filtersChanged ? filtered : [...prev, ...filtered];
        });

        if (newData.length === 0) setHasMore(false);
        else pageRef.current++;
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError((err as Error).message || "Failed to load posts");
      }
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
      oldFiltersRef.current = filters;
      abortControllerRef.current = null;
    }
  };

  const resetAndFetch = (filters: ListingFilters = {}) => {
    oldFiltersRef.current = null;
    getListingPosts(filters);
  };

  return {
    getListingPosts,
    resetAndFetch,
    data,
    loading,
    hasMore,
    error,
    isInitialLoad,
  };
};
