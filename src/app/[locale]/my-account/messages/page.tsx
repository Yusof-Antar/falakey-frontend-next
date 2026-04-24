"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const MessagesDashboard = dynamicComponent(
  () => import("@/src/views/MessagesDashboard"),
  { ssr: false },
);

export default MessagesDashboard;
