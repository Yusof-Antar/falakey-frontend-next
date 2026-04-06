'use client';
import { useDownloadHook } from "@/helper/downloadHook";
import { RootState } from "@/lib/store";
import { useTrans } from "@/utils/translation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Download, Image, Search } from "lucide-react";

const DownloadsDashboard = () => {
  const { getDownloads, data, loading } = useDownloadHook();
  const { local } = useSelector((state: RootState) => state.translation);
  const { t } = useTrans();

  useEffect(() => {
    getDownloads();
  }, []);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Download className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        {t("download.empty_title") || "No Downloads Yet"}
      </h3>
      <p className="text-gray-500 max-w-md">
        {t("download.empty_description") || "Your downloaded items will appear here"}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br w-full">
      <div className="sm:px-8 md:px-12 xl:px-16 py-8 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-[28px] sm:text-[32px] md:text-[36px] font-bold font-lexend text-gray-800">
              {t("download.title")}
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base ml-14">
            {t("download.subtitle") || "Manage and access all your downloaded content"}
          </p>
        </div>

        {/* Stats Card (Optional - shows download count) */}
        {!loading && data && data.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 inline-block">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium">
                {data.length} {data.length === 1 ? t("download.item") || "item" : t("download.items") || "items"}
              </span>
            </div>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <LoadingSkeleton />
        ) : !data || data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((download) => (
              <a
                key={download.slug}
                href={`/${local}/${download.type}/${download.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={download.preview_links?.thumb}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={download.title}
                    loading="lazy"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Search className="w-4 h-4" />
                        <span>{t("download.view_details") || "View Details"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 shadow-sm">
                      {download.type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {download.title}
                  </h3>
                  
                  {download.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {download.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsDashboard;