"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Dashboard = dynamicComponent(() => import("@/src/views/Dashboard"), {
  ssr: false,
});

export default Dashboard;
