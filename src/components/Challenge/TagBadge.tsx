"use client";
import type { RootState } from "@/types/RootState";
import { useSelector } from "react-redux";

const TagBadge = ({
  dot,
  title,
  href,
  black,
  ended,
  red,
}: {
  dot?: boolean;
  title: string;
  href?: string;
  black?: boolean;
  ended?: boolean;
  red?: boolean;
}) => {
  const { dir } = useSelector((state: RootState) => state.translation);
  return (
    <a
      href={href}
      dir={dir}
      target="_blank"
      className={`flex items-center gap-2 border rounded-full py-2 px-3 ${
        ended
          ? "border-secondary text-secondary"
          : black
            ? "border-[#dfdfe0] text-black"
            : "border-white text-white"
      } ${href != null ? "cursor-pointer" : "cursor-default"} text-xs`}
    >
      {dot && (
        <div
          className={`rounded-full size-[7px] ${
            red || ended ? "bg-secondary animate-pulse" : "bg-white"
          }`}
        />
      )}
      {title}
    </a>
  );
};

export default TagBadge;
