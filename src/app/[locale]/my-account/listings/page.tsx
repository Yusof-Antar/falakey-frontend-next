"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const ListingsDashboard = dynamicComponent(
  () => import("@/src/views/ListingsDashboard"),
  { ssr: false },
);

export default ListingsDashboard;
