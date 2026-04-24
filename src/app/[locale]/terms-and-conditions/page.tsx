"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Terms = dynamicComponent(() => import("@/src/views/Terms"), {
  ssr: false,
});

export default Terms;
