"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Stars = dynamicComponent(() => import("@/src/views/Stars"), {
  ssr: false,
});

export default Stars;
