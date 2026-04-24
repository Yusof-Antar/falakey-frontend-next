"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const NotificationSettingsDashboard = dynamicComponent(
  () => import("@/src/views/NotificationSettingsDashboard"),
  { ssr: false },
);

export default NotificationSettingsDashboard;
