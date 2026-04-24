"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const AiGallery = dynamicComponent(() => import("@/src/views/AiGallery"), {
  ssr: false,
});

export default AiGallery;
