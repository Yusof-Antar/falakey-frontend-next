"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const NotificationsDashboard = dynamicComponent(
  () => import("@/src/views/NotificationsDashboard"),
  { ssr: false },
);

export default NotificationsDashboard;
