"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Challenge = dynamicComponent(() => import("@/src/views/Challenge"), {
  ssr: false,
});

export default Challenge;
