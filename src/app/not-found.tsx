"use client";
import dynamic from "next/dynamic";
const PageNotFound = dynamic(() => import("@/src/pages/PageNotFound"), {
  ssr: false,
});
export default function NotFound() {
  return <PageNotFound />;
}
