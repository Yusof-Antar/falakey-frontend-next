"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const DownloadsDashboard = dynamicComponent(
  () => import("@/src/views/DownloadsDashboard"),
  { ssr: false },
);

export default DownloadsDashboard;
