"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Author = dynamicComponent(() => import("@/src/views/Author"), {
  ssr: false,
});

export default Author;
