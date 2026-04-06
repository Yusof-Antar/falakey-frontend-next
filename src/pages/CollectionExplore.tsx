"use client";

import { useParams, useSearchParams } from "next/navigation";
import ExploreInputs from "@/components/Explore/ExploreInputs";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParamsHook } from "@/helper/searchHook";
import { search } from "@/lib/slices/searchSlice";
import SEO from "@/components/Common/SEO";
import { RootState } from "@/lib/store";
import { useTrans } from "@/utils/translation";
import MasonryWrapper from "@/components/Masonry/MasonryWrapper";
import { useEffect, useMemo } from "react";
import { sortingVar } from "@/utils/defaultVariables";

const CollectionExplore = () => {
  const params = useParams();
  const searchParams = useSearchParams(); // Safe Next.js hook for query strings
  const dispatch = useDispatch();
  const stringFiltering = useSearchParamsHook();
  const previousearchData = useSelector((state: RootState) => state.search);
  const { t } = useTrans();

  // Handle the collection parameter safely
  const collectionName = useMemo(() => {
    const rawCollection = Array.isArray(params.collection)
      ? params.collection[0]
      : params.collection;

    return rawCollection || "";
  }, [params.collection]);

  useEffect(() => {
    // We use searchParams.get() instead of location.search
    // This is safe during Next.js 'npm run build'
    dispatch(
      search({
        ...previousearchData,
        types: searchParams.get("types") ?? previousearchData.types,
        search: searchParams.get("search") ?? previousearchData.search,
        filter: {
          orientation:
            searchParams.get("orientation") ??
            previousearchData.filter?.orientation ??
            null,
          size:
            searchParams.get("size") ?? previousearchData.filter?.size ?? null,
          color:
            searchParams.get("color") ??
            previousearchData.filter?.color ??
            null,
        },
        sorting:
          searchParams.get("sorting") ??
          previousearchData.sorting ??
          sortingVar,
        collection:
          searchParams.get("collection") ??
          previousearchData.collection ??
          null,
      }),
    );
    // Adding searchParams to dependencies ensures Redux stays in sync with URL
  }, [dispatch, searchParams]);

  // Formatting the title for SEO
  const formattedTitle = useMemo(() => {
    return collectionName
      ?.split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [collectionName]);

  return (
    <>
      <SEO
        title={`Collection | ${formattedTitle}`}
        description=""
        name="Falakey"
        type="article"
      />

      <div className="header flex flex-col flex-wrap items-center justify-center">
        <div className="explore w-full max-w-screen-size px-4">
          <div className="mb-[16px] font-bold min-[319px]:text-[28px] min-[425px]:text-[36px] min-[768px]:text-[55px] min-[1024px]:text-[70px]">
            {t("navbar.explore")}
          </div>
          <ExploreInputs />
          <div className="mt-4 w-full">
            <MasonryWrapper title="" stringFiltering={stringFiltering} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionExplore;
