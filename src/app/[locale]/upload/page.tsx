"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Upload = dynamicComponent(() => import("@/src/views/Upload"), {
  ssr: false,
});

export default Upload;
