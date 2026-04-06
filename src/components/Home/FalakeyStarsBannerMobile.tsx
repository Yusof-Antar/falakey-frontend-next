"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LeaderBoardUser } from "@/models/leaderBoardUser";
const unkownProfile = "/images/unkown-profile.png";
const starIcon = "/icons/star-icon.svg";
import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { ChevronLeft, ChevronRight } from "lucide-react"; // only right arrow
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";

const FalakeyStarsBannerMobile = ({
  leaderBoardUser,
}: {
  leaderBoardUser: LeaderBoardUser[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigateWithLocale();
  const { t } = useTrans();
  const { local, dir } = useSelector((state: RootState) => state.translation);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTime = 6000; // 6 seconds

  // function to move next
  const goNext = (e?: any) => {
    if (e) {
      e.stopPropagation();
    }

    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % leaderBoardUser.length);
      setFade(true);
    }, 300);

    // reset timer whenever user clicks
    if (e) {
      resetTimer();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, intervalTime);
  };

  // Auto-change
  useEffect(() => {
    if (!leaderBoardUser.length) return;
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderBoardUser]);

  if (!leaderBoardUser.length) {
    return (
      <div className="h-full lg:w-fit w-full lg:min-w-[350px] bg-tertiary rounded-3xl p-4 flex items-center justify-center">
        No leaderboard data
      </div>
    );
  }

  const leader = leaderBoardUser[currentIndex];

  return (
    <div className=" h-full lg:w-fit w-full lg:min-w-[350px] bg-tertiary rounded-3xl sm:p-4 p-2 pt-4 pb-6 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <h2 className="sm:text-lg text-md font-bold text-purple-900">
          {t("stars.falakey_stars")}
        </h2>
        <a
          href={`/${local}/falakey-stars`}
          className="sm:text-sm text-xs text-gray-500 underline"
        >
          {t("stars.see_all") || "See all"}
        </a>
      </div>

      {/* Leaderboard User with fade animation */}
      <div
        className={`transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="w-full cursor-pointer flex items-center h-fit py-1"
          onClick={() => {
            navigate(`/@${leader.author?.username}`);
          }}
        >
          <div className="flex justify-between w-full h-fit py-1 items-center border-primary">
            <div className="relative flex w-full gap-5 items-center overflow-visible">
              {/* Avatar + Rank */}
              <div className="relative flex items-center justify-center aspect-square size-[50px]">
                <img
                  src={leader.author?.avatar ?? unkownProfile}
                  className="rounded-full object-cover aspect-square size-full"
                  alt={leader.author?.display_name}
                />
                <div className="absolute top-0 end-0 rtl:-translate-x-1/3 translate-x-1/3 -translate-y-1/3 size-[35px]">
                  <div className="absolute text-white top-1/2 start-1/2 rtl:translate-x-1/2 -translate-x-1/2 -translate-y-1/2">
                    {leader.rank}
                  </div>
                  <Image
                    src={starIcon}
                    alt="Star Icon"
                    className="size-full"
                    width={100}
                    height={100}
                  />
                </div>
              </div>

              {/* Name & Views */}
              <div>
                <div className="!leading-5 text-primary sm:text-md xs:text-sm text-[15px] font-bold overflow-hidden">
                  {leader.author?.display_name}
                </div>
                <div className="sm:gap-1 gap-1 flex items-baseline">
                  <div className="text-secondary font-bold sm:text-2xl text-md">
                    {leader.total_views_display}
                  </div>
                  <div className="text-primary font-bold sm:text-lg text-xs">
                    {t("stars.views")}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-1 end-0 flex justify-end pe-2">
                <button
                  onClick={goNext}
                  className="size-5 flex items-center justify-center rounded-full border border-primary text-primary transition"
                >
                  {dir === "rtl" ? (
                    <ChevronLeft className="size-full" />
                  ) : (
                    <ChevronRight className="size-full" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next arrow only */}
    </div>
  );
};

export default FalakeyStarsBannerMobile;
