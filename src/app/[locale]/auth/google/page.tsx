"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const GoogleCallback = dynamicComponent(
  () => import("@/src/views/GoogleCallback"),
  { ssr: false },
);

export default GoogleCallback;
