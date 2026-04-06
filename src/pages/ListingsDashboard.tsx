'use client';
import { useEffect, useState, useMemo } from "react";
import ListingBox from "../components/ListingDashboard/ListingBox";
import { useListingHook } from "@/helper/listingHook";
import { Post } from "@/models/post";
import { useTrans } from "@/utils/translation";
import { useFetchChallenge } from "@/helper/challengeHook";

// Loading Skeleton Components
const FilterSkeleton = () => (
  <div className="flex flex-col gap-2 animate-pulse">
    <div className="h-5 w-16 bg-gray-200 rounded" />
    <div className="h-11 sm:h-12 bg-gray-200 rounded-lg" />
  </div>
);

const ListingCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="relative">
      {/* Image skeleton with shimmer effect */}
      <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_2s_infinite] bg-[length:200%_100%]" />
    </div>
    
    <div className="p-4 space-y-3">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </div>
      
      {/* Details skeleton */}
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
      </div>
      
      {/* Footer skeleton */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
      </div>
    </div>
  </div>
);

const ListingDashboard = () => {
  const { getListingPosts, data, loading } = useListingHook();
  const { data: challenges, loading: challengeLoading } = useFetchChallenge();

  useEffect(() => {
    getListingPosts();
  }, []);

  const [filteredType, setFilteredType] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Helper function to format status/type display text
  const formatLabel = (str: string) => {
    return str
      .split("_")
      .map((word) => capitalizeFirst(word))
      .join(" ");
  };

  // Extract unique types from data
  const availableTypes = useMemo(() => {
    if (!data || data.length === 0) return [];

    const types = data
      .map((listing: Post) => listing.type)
      .filter((type): type is string => !!type);

    return Array.from(new Set(types));
  }, [data]);

  // Extract unique statuses from data
  const availableStatuses = useMemo(() => {
    if (!data || data.length === 0) return [];

    const statuses = data
      .map((listing: Post) => listing.status)
      .filter((status): status is { key: string; color: string } => !!status);

    const uniqueStatuses = Array.from(
      new Map(statuses.map((status) => [status?.key, status])).values(),
    );

    return uniqueStatuses;
  }, [data]);

  const filteredListings = (data ?? []).filter((listing: Post) => {
    const typeMatch = filteredType ? listing!.type! === filteredType : true;
    const statusMatch = filteredStatus
      ? listing.status?.key === filteredStatus
      : true;
    return typeMatch && statusMatch;
  });

  const handleClearFilters = () => {
    setFilteredType("");
    setFilteredStatus("");
  };

  const { t } = useTrans();

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-lexend text-gray-900 mb-4 sm:mb-6 md:mb-8">
        {t("listing_dashboard.listings")}
      </h1>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8 transition-shadow duration-200 hover:shadow-md">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <FilterSkeleton />
            <FilterSkeleton />
            <FilterSkeleton />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {/* Type Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 font-lexend">
                  {t("listing_dashboard.type")}
                </label>
                <select
                  name="listing_type"
                  className="h-11 sm:h-12 border border-gray-300 text-sm sm:text-base font-lexend rounded-lg px-3 sm:px-4 appearance-none bg-white hover:border-gray-400 focus:border-[#44175B] focus:ring-2 focus:ring-[#44175B]/20 transition-all outline-none cursor-pointer"
                  onChange={(e) => setFilteredType(e.target.value)}
                  value={filteredType}
                >
                  <option value="">{t("listing_dashboard.all_types")}</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {formatLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 font-lexend">
                  {t("listing_dashboard.status")}
                </label>
                <select
                  name="listing_status"
                  className="h-11 sm:h-12 border border-gray-300 text-sm sm:text-base font-lexend rounded-lg px-3 sm:px-4 appearance-none bg-white hover:border-gray-400 focus:border-[#44175B] focus:ring-2 focus:ring-[#44175B]/20 transition-all outline-none cursor-pointer"
                  onChange={(e) => setFilteredStatus(e.target.value)}
                  value={filteredStatus}
                >
                  <option value="">{t("listing_dashboard.all_status")}</option>
                  {availableStatuses.map((status) => (
                    <option key={status?.key} value={status?.key}>
                      {formatLabel(status!.key)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <label className="text-xs sm:text-sm font-medium text-transparent font-lexend hidden md:block select-none">
                  {t("listing_dashboard.actions")}
                </label>
                <div className="flex gap-2 h-11 sm:h-12">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 border border-gray-300 bg-white text-gray-700 text-sm sm:text-base font-semibold font-lexend rounded-lg px-3 sm:px-4 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150"
                  >
                    {t("listing_dashboard.clear")}
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex-1 bg-[#44175B] text-white text-sm sm:text-base font-semibold font-lexend rounded-lg px-3 sm:px-4 hover:bg-[#5a1e75] active:bg-[#331056] transition-all duration-150 shadow-sm hover:shadow"
                  >
                    {t("listing_dashboard.filter")}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filteredType || filteredStatus) && (
              <div className="mt-4 sm:mt-5 flex flex-wrap gap-2 items-center">
                <span className="text-xs sm:text-sm font-medium text-gray-600 font-lexend">
                  {t("listing_dashboard.active_filters")}:
                </span>
                {filteredType && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#44175B]/10 text-[#44175B] rounded-full text-xs sm:text-sm font-medium transition-all hover:bg-[#44175B]/20">
                    <span className="font-lexend">
                      {t("listing_dashboard.type")}: {formatLabel(filteredType)}
                    </span>
                    <button
                      onClick={() => setFilteredType("")}
                      className="ml-0.5 hover:text-[#5a1e75] text-base sm:text-lg leading-none transition-colors"
                      aria-label="Remove type filter"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filteredStatus && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#44175B]/10 text-[#44175B] rounded-full text-xs sm:text-sm font-medium transition-all hover:bg-[#44175B]/20">
                    <span className="font-lexend">
                      {t("listing_dashboard.status")}: {formatLabel(filteredStatus)}
                    </span>
                    <button
                      onClick={() => setFilteredStatus("")}
                      className="ml-0.5 hover:text-[#5a1e75] text-base sm:text-lg leading-none transition-colors"
                      aria-label="Remove status filter"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Listings Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <ListingCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-5 lg:gap-6">
          {filteredListings.map((data, index) => (
            <ListingBox
              key={data.id || index}
              data={data}
              challenges={challenges?.active ?? []}
              challengeLoading={challengeLoading}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4">
          <div className="text-center space-y-3 sm:space-y-4 max-w-md">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 font-lexend">
              {t("listing_dashboard.no_listing")}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 font-lexend px-4">
              {filteredType || filteredStatus
                ? "Try adjusting your filters to see more results"
                : "There are no listings available at the moment"}
            </p>
            {(filteredType || filteredStatus) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 sm:mt-6 px-5 sm:px-6 py-2 sm:py-2.5 bg-[#44175B] text-white text-sm sm:text-base font-semibold font-lexend rounded-lg hover:bg-[#5a1e75] active:bg-[#331056] transition-all duration-150 shadow-sm hover:shadow"
              >
                {t("listing_dashboard.clear_all")}
              </button>
            )}
          </div>
        </div>
      )}

      
    </div>
  );
};

export default ListingDashboard;