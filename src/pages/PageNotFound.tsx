"use client";
import Link from "next/link";

import { FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useTrans } from "@/utils/translation";

const PageNotFound = () => {
  const { local } = useSelector((state: RootState) => state.translation);
  const { t } = useTrans();
  return (
    <div className="min-h-full w-full flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center max-w-xl">
        <div className="text-7xl font-bold text-primary drop-shadow-sm">
          404
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-gray-800">
          {t("not_found.title")}
        </h1>
        <p className="mt-2 text-gray-600 text-base">
          {t("not_found.description")}
        </p>

        <div className="mt-6">
          <Link
            href={`/${local}/`}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md shadow hover:bg-primary/70 transition"
          >
            <FaArrowLeft className="text-sm" />
            {t("not_found.home_button")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
