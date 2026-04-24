"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Plans = dynamicComponent(() => import("@/src/views/Plans"), {
  ssr: false,
});

export default Plans;
