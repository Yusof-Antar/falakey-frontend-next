"use client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import { search } from "@/lib/slices/searchSlice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFetchFilter } from "@/helper/filterHook";
import { MenuItem, Select } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useEffect, useState } from "react";
import { useTrans } from "@/utils/translation";
import { sortingExploreVar } from "@/utils/defaultVariables";

const ExploreInputs = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { data, loading } = useFetchFilter(searchParams?.toString() ?? "");

  const searchState = useSelector((state: RootState) => state.search);

  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState({
    orientation:
      searchParams?.get("orientation") || data?.orientations?.[0]?.key || "all",
    size: searchParams?.get("size") || null,
    color: searchParams?.get("color") || null,
  });

  const [selectedSort, setSelectedSort] = useState(
    searchParams?.get("sorting") || sortingExploreVar,
  );

  const handleFilterChange = (key: string, value: string | null) => {
    setSelectedFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
  };

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchState.types) params.set("types", searchState.types);
    if (selectedFilter.orientation)
      params.set("orientation", selectedFilter.orientation);
    if (selectedFilter.size) params.set("size", selectedFilter.size);
    if (selectedFilter.color) params.set("color", selectedFilter.color);
    params.set("sorting", selectedSort);

    router.replace(`${pathname}?${params.toString()}`);
  }, [selectedFilter, selectedSort, pathname, router, searchState.types]);

  const { t } = useTrans();

  return (
    <div className="flex flex-col gap-3 ">
      {loading ? (
        <div className="flex justify-between gap-3 animate-pulse">
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="h-[50px] w-32 bg-gray-200 rounded-xl" />
            <div className="h-[50px] w-32 bg-gray-200 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between max-sm:flex-col gap-3 sm:items-center items-start sm:max-h-[50px]">
            <div className="flex flex-wrap gap-3 max-sm:w-full max-sm:overflow-x-scroll max-sm:items-center items-start">
              {data?.types.map((type, index) => (
                <div
                  key={index}
                  className={`flex items-center sm:h-[50px] h-10 cursor-pointer py-3 px-4 gap-1 ${
                    (searchState.types ?? "photo") === type.key
                      ? "bg-primary text-white"
                      : "bg-transparent text-black hover:bg-gray-100 hover:text-primary"
                  } rounded-full`}
                  onClick={() => {
                    if ((type.count ?? 0) > 0)
                      dispatch(
                        search({
                          ...searchState,
                          types: type.key,
                          placeholder: type.search_placeholder,
                        }),
                      );
                  }}
                >
                  <div className="sm:text-md text-sm font-semibold">
                    {type.name}
                  </div>
                  <span
                    className={`sm:text-xs text-[10px] ${
                      searchState.types === type.key
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {type.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 items-center max-sm:justify-between">
              <div
                onClick={() => setOpenFilter(!openFilter)}
                className="flex items-center h-[50px] gap-2 border-2 border-gray-200 px-4 py-2 rounded-xl cursor-pointer"
              >
                <FilterListIcon />
                <div>{t("explore.filters")}</div>
              </div>
              <Select
                value={selectedSort}
                className="max-h-[50px] !rounded-xl"
                onChange={(e) => {
                  dispatch(search({ ...searchState, sorting: e.target.value }));
                  handleSortChange(e.target.value);
                }}
              >
                {data?.sorting.map((sort, index) => (
                  <MenuItem key={index} value={sort.key}>
                    {sort.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          {openFilter && (
            <div>
              <Select
                value={selectedFilter["orientation"]}
                className="max-h-[50px] w-full max-w-[300px] !rounded-xl"
                onChange={(e) => {
                  dispatch(
                    search({
                      ...searchState,
                      filter: {
                        ...searchState.filter,
                        orientation: e.target.value,
                      },
                    }),
                  );
                  handleFilterChange("orientation", e.target.value);
                }}
              >
                {data?.orientations.map((orient, index) => (
                  <MenuItem key={index} value={orient.key}>
                    {orient.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreInputs;
