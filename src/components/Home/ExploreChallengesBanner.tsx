"use client";
import Link from "next/link";
// const leftStar = "/images/left-stars.gif";

import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import { Challenge } from "@/models/challenge";
import { getDaysLeftString } from "@/utils/getDaysLeftString";
// ** Import React hooks
import { useState, useEffect } from "react";

const ExploreChallengesBanner = ({ challenge }: { challenge: Challenge }) => {
  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  // ** 1. State to track the current image index **
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ** Use the array of media URLs from the challenge object **
  // Assuming challenge.media is an array of objects, and each has an 'original' property (string)
  const imageSources: string[] = challenge.media.map(
    (mediaItem) => mediaItem.original || mediaItem.thumb || mediaItem.sm,
  );
  const totalImages = imageSources.length;

  // ** 2. useEffect to handle the looped crossfade transition **
  useEffect(() => {
    // Only set up the interval if there are images to cycle
    if (totalImages > 1) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
      }, 3000); // 3000 milliseconds = 3 seconds

      // Cleanup function to clear the interval when the component unmounts or dependencies change
      return () => clearInterval(intervalId);
    }
  }, [totalImages]); // Re-run effect if the number of images changes

  return (
    <Link href={`/${local}/challenge`} className="relative block h-full">
      <div className="flex cursor-pointer h-full lg:min-h-[90px] min-h-[90px] lg:w-fit w-full lg:min-w-[320px] overflow-hidden relative lg:justify-evenly justify-center items-center rounded-3xl ">
        <div className="z-10 w-full h-full flex flex-col justify-evenly text-white text-start font-semibold px-4">
          <div className="sm:block hidden xl:text-sm lg:text-xs md:text-sm sm:text-xs text-xs">
            <i className="fa-solid fa-hourglass me-1" />
            {getDaysLeftString(t, challenge?.days_left ?? 0)}
          </div>
          <div className="flex justify-between items-end xl:text-xl text-lg">
            {challenge.title}
            <div className="sm:block hidden text-xs text-left">
              {t("challenge.join")}{" "}
              <i
                className={`fa-solid fa-arrow-${
                  local === "ar" ? "left" : "right"
                }`}
              />
            </div>
          </div>
          <div className="sm:hidden block text-end xl:text-sm lg:text-xs md:text-sm sm:text-xs text-xs">
            <i className="fa-solid fa-hourglass me-1" />{" "}
            {getDaysLeftString(t, challenge?.days_left ?? 0)}
          </div>
        </div>

        {/* Render all images stacked, with only the current one visible */}
        {imageSources.map((src, index) => (
          <img
            key={index}
            src={src}
            className={`h-full w-full object-cover absolute transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            alt={`Challenge Banner Background ${index + 1}`}
          />
        ))}

        <div className="absolute right-0 left-0 size-full bg-black/35" />
      </div>
    </Link>
  );
};

export default ExploreChallengesBanner;
