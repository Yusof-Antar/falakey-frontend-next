"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Privacy = dynamicComponent(() => import("@/src/views/Privacy"), {
  ssr: false,
});

export default Privacy;
