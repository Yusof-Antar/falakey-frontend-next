"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const AccountDetailsDashboard = dynamicComponent(
  () => import("@/src/views/AccountDetailsDashboard"),
  { ssr: false },
);

export default AccountDetailsDashboard;
