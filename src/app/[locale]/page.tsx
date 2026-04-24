"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const Home = dynamicComponent(() => import("@/src/views/Home"), { ssr: false });

export default Home;
