"use client";
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";

import HomeBanner from "@/components/Home/HomeBanner";
import FalakeyStarsBanner from "@/components/Home/FalakeyStarsBanner";
import ExploreChallengesBanner from "@/components/Home/ExploreChallengesBanner";

import { useHomeHook } from "@/helper/homeHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import { useTrans } from "@/utils/translation";
import MasonryWrapper from "@/components/Masonry/MasonryWrapper";
import SEO from "@/components/Common/SEO";
import { search } from "@/lib/slices/searchSlice";
import SearchTypeBanner from "@/components/Home/SearchTypeBanner";
// import { useFetchFilter } from "@/helper/filterHook";
import { useSearchParams } from "next/navigation";
import FalakeyStarsBannerMobile from "@/components/Home/FalakeyStarsBannerMobile";
import { sortingVar } from "@/utils/defaultVariables";
const Home = () => {
  const searchParams = useSearchParams();

  const { getHomeData, loading, data } = useHomeHook();

  // const { data: filters } = useFetchFilter(""); // Fetch based on URL params

  const dispatch = useDispatch();

  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  const { types } = useSelector((state: RootState) => state.search);

  const previousSearch = useSelector((state: RootState) => state.search);

  const masonryRef = useRef<HTMLDivElement | null>(null);
  const [scrolling, setScrolling] = useState(false);
  const handleScrollToMasonry = () => {
    setScrolling(true);
    const offset = 70; // Adjust offset as needed
    const targetPosition =
      masonryRef.current!.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top: targetPosition, behavior: "smooth" });
    setTimeout(() => {
      setScrolling(false);
    }, 3000);
  };

  // const [selectedSort, setSelectedSort] = useState(
  //   searchParams.get("sorting") || sortingVar
  // );

  const selectedSort = searchParams.get("sorting") || sortingVar;

  useEffect(() => {
    dispatch(
      search({
        author: null,
        types: previousSearch!.types,
        placeholder: previousSearch.placeholder,
        sorting: selectedSort,
      }),
    );
    getHomeData();
  }, [local]);

  if (loading) {
    return (
      <div className="mt-6">
        <div className="w-full flex justify-center">
          <div className="lg:block hidden sm:max-w-screen-size w-[95%] space-y-5">
            {/* Desktop Layout */}
            <div className="h-fit w-full gap-5 flex lg:flex-row flex-col">
              {/* SearchTypeBanner skeleton */}
              <div className="w-full h-[80px] lg:min-h-[100px] min-h-[60px] flex-1 bg-gray-300 animate-pulse rounded-3xl" />
              {/* ExploreChallengesBanner skeleton */}
              <div className="h-full lg:min-h-[100px] min-h-[100px] lg:w-fit w-full lg:min-w-[350px] bg-gray-300 animate-pulse rounded-3xl" />
            </div>

            <div className="flex lg:flex-row flex-col gap-5 h-fit w-full">
              {/* HomeBanner skeleton */}
              <div className="lg:flex-1 max-lg:h-full min-h-[350px] bg-gray-300 animate-pulse rounded-3xl" />
              {/* FalakeyStars skeleton */}
              <div className="h-full lg:w-fit w-full lg:min-w-[350px] min-h-[350px] bg-gray-300 animate-pulse rounded-3xl" />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden block sm:max-w-screen-size w-[95%]">
            <div className="lg:grid-cols-[1fr_300px] grid grid-cols-1  gap-4">
              {/* SearchTypeBanner skeleton */}
              <div className="flex-1 h-full lg:min-h-[100px] min-h-[50px] w-full bg-gray-300 animate-pulse rounded-xl" />

              {/* HomeBanner skeleton */}
              <div className="h-[270px] md:h-[325px] lg:h-[375px] w-full bg-gray-300 animate-pulse rounded-3xl" />
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-4 mt-4 lg:grid-cols-1 items-start h-[clamp(110px,8vw,160px)] min-[430px]:h-[clamp(125px,9vw,175px)] min-[768px]:h-[clamp(140px,10vw,200px)]">
              {/* ExploreChallenges skeleton */}
              <div className="h-full w-[clamp(110px,8vw,160px)]  min-[400px]:w-[clamp(170px,9vw,225px)] min-[600px]:w-[clamp(300px,10vw,400px)] min-[800px]:w-[clamp(350px,12vw,500px)] min-[1000px]:w-[clamp(450px,12vw,600px)]   bg-gray-300 animate-pulse rounded-3xl" />
              {/* FalakeyStarsMobile skeleton */}
              <div className="lg:hidden w-full h-[clamp(110px,8vw,160px)] min-[430px]:h-[clamp(125px,9vw,175px)] min-[768px]:h-[clamp(140px,10vw,200px)] bg-gray-300 animate-pulse rounded-3xl" />
            </div>
          </div>
        </div>

        {/* Title + Subtitle Skeleton */}
        <div className="sm:max-w-screen-size w-[95%] mx-auto mt-10 flex flex-col items-center md:items-start">
          <div className="h-6 sm:h-8 w-[70%] sm:w-[50%] bg-gray-300 animate-pulse rounded-md mb-3" />
          <div className="h-4 sm:h-6 w-[90%] sm:w-[65%] bg-gray-300 animate-pulse rounded-md" />
        </div>

        {/* Loader Spinner */}
        <div className="mt-6 mb-12 flex items-center justify-center gap-3 text-xl font-semibold text-primary">
          <FontAwesomeIcon
            icon={faSpinner}
            className="size-[30px] animate-spin"
            style={{ animationDuration: "2000ms" }}
          />
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO />

      <div className="w-full flex justify-center mt-6">
        <div className="lg:block hidden sm:max-w-screen-size w-[95%] space-y-5">
          <div className="h-fit w-full gap-5 flex lg:flex-row flex-col">
            <SearchTypeBanner
              types={data?.types ?? []}
              handleScrollToMasonry={handleScrollToMasonry}
            />
            {data?.challenges?.[0] && (
              <ExploreChallengesBanner challenge={data.challenges[0]} />
            )}
          </div>
          <div className="flex lg:flex-row flex-col gap-5 h-fit  w-full">
            <HomeBanner
              slogan={t("home.banner_slogan")}
              author={
                (data?.banner.author.display_name ||
                  data?.banner.author.username) ??
                ""
              }
              authorSlug={data?.banner.author.username ?? ""}
              categoryVar={previousSearch.types}
              homeImage={data?.banner.image}
              typeOptions={data?.types ?? []}
              bannerPosition={data?.banner.position}
              // collections={data?.collections ?? []}
            />
            <FalakeyStarsBanner leaderBoardUser={data?.leaderboard ?? []} />
          </div>
        </div>

        <div className="lg:hidden block sm:max-w-screen-size w-[95%]">
          {/* First row: On lg and bigger, two divs side by side */}
          <div className="lg:grid-cols-[1fr_300px] grid grid-cols-1  gap-4">
            {/* First container */}
            <SearchTypeBanner
              types={data?.types ?? []}
              handleScrollToMasonry={handleScrollToMasonry}
            />
            <div className="h-[270px] md:h-[325px] lg:h-[375px] w-full">
              <HomeBanner
                slogan={t("home.banner_slogan")}
                author={
                  (data?.banner.author.display_name ||
                    data?.banner.author.username) ??
                  ""
                }
                authorSlug={data?.banner.author.username ?? ""}
                categoryVar={previousSearch.types}
                homeImage={data?.banner.image}
                typeOptions={data?.types ?? []}
                // collections={data?.collections ?? []}
                bannerPosition={data?.banner.position}
              />
            </div>
          </div>

          {/* Second row: On lg and bigger, full-width third container */}
          {/* On smaller screens, second and third containers are side by side */}
          <div className="flex gap-4 mt-4 h-[clamp(110px,8vw,160px)] min-[430px]:h-[clamp(125px,9vw,175px)] min-[768px]:h-[clamp(140px,10vw,200px)]">
            {/* Explore Banner */}
            <div className="flex-[0.85] h-full">
              {data?.challenges?.[0] && (
                <ExploreChallengesBanner challenge={data.challenges[0]} />
              )}
            </div>

            {/* Stars Banner */}
            <div className="flex-1 h-full">
              <FalakeyStarsBannerMobile
                leaderBoardUser={data?.leaderboard ?? []}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full ${
          scrolling ? "pb-[75%]" : ""
        } bg-white flex flex-col justify-center items-center`}
      >
        <div className="sm:max-w-screen-size w-[95%] flex md:justify-between justify-start items-center ">
          <div className="text-start my-10 flex flex-col items-start justify-end sm:gap-0.5 gap-1">
            <div className="xl:text-4xl lg:text-3xl sm:text-2xl text-lg  text-primary font-bold leading-6">
              {data?.types.find((type) => type.key === types)?.home_title_1 ??
                "The right photo for every moment"}
            </div>
            <div className="xl:text-2xl lg:text-xl sm:text-xl text-md font-bod text-primary/60  leading-5">
              {data?.types.find((type) => type.key === types)
                ?.home_subtitle_1 ??
                "Professional photos to express your ideas and connect with your audience"}
            </div>
          </div>
          {/* <div className="md:block hidden">
            <Select
              value={selectedSort}
              className="max-h-[50px] !rounded-xl "
              onChange={(e) => {
                dispatch(
                  search({ ...previousSearch, sorting: e.target.value })
                );
                setSelectedSort(e.target.value);
              }}
            >
              {filters?.sorting.map(
                (sort, index) =>
                  sort.key !== "relevance" && (
                    <MenuItem key={index} value={sort.key}>
                      {sort.label}
                    </MenuItem>
                  )
              )}
            </Select>
          </div> */}
        </div>
        <div className={`w-full flex justify-center`} ref={masonryRef}>
          <MasonryWrapper
            title=""
            stringFiltering={`types=${types}&sorting=${selectedSort}`}
            screenWidth="w-[95%]"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
