"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Collections = dynamicComponent(() => import("@/src/views/Collections"), {
  ssr: false,
});

export default Collections;
