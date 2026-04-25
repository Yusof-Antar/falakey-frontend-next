"use client";
import { useEffect } from "react";

export type SEOPROPS = {
  title?: string;
  description?: string;
  name?: string;
  type?: string;
  image?: string;
  keywords?: string;
};

export default function SEO({ title }: SEOPROPS) {
  useEffect(() => {
    if (title) {
      document.title = title.includes("Falakey")
        ? title
        : `${title} | Falakey`;
    }
  }, [title]);

  return null;
}
