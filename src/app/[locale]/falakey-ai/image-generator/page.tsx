"use client";
export const dynamic = "force-dynamic";

import dynamicComponent from "next/dynamic";

const AiChat = dynamicComponent(() => import("@/src/views/AiChat"), {
  ssr: false,
});

export default AiChat;
