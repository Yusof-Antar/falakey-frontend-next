"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ExploreInputs from "./ExploreInputs";
import { useDispatch, useSelector } from "react-redux";
import { search } from "@/lib/slices/searchSlice";
import { useSearchParamsHook } from "@/helper/searchHook";
import SEO from "../Common/SEO";
import type { RootState } from "@/types/RootState";
import { useTrans } from "@/utils/translation";
import MasonryWrapper from "../Masonry/MasonryWrapper";
import { sortingExploreVar } from "@/utils/defaultVariables";

const Explore = () => {
  const dispatch = useDispatch();
  const stringFiltering = useSearchParamsHook();
  const urlSearchParams = useSearchParams();
  const previousearchData = useSelector((state: RootState) => state.search);

  useEffect(() => {
    const params = new URLSearchParams(urlSearchParams?.toString() || "");

    dispatch(
      search({
        ...previousearchData,
        types: params.get("types") ?? previousearchData.types,
        search: params.get("search") ?? previousearchData.search,
        collection: params.get("collection") ?? previousearchData.collection,
        filter: {
          orientation:
            params.get("orientation") ??
            previousearchData.filter?.orientation ??
            null,
          size:
            params.get("size") ?? previousearchData.filter?.size ?? null,
          color:
            params.get("color") ?? previousearchData.filter?.color ?? null,
        },
        sorting: params.get("sorting") ?? sortingExploreVar,
      }),
    );
  }, [dispatch, urlSearchParams]);

  const { t } = useTrans();

  return (
    <>
      <SEO
        title={t("seo.explore_title")}
        description={t("seo.explore_description")}
      />

      <div className="header justify-center items-center flex flex-col flex-wrap">
        <div className="explore w-full max-w-screen-size px-4">
          <div className="min-[1024px]:text-[70px] min-[319px]:text-[28px] min-[425px]:text-[36px] min-[768px]:text-[55px] font-bold mb-4">
            {t("explore.title")}
          </div>

          <ExploreInputs />
          <div className="w-full mt-4">
            <MasonryWrapper title="" stringFiltering={stringFiltering} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
