"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const License = dynamicComponent(() => import("@/src/views/License"), {
  ssr: false,
});

export default License;
