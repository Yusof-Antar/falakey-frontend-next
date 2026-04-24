"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const PictureDetail = dynamicComponent(
  () => import("@/src/views/PictureDetail"),
  { ssr: false },
);

export default PictureDetail;
