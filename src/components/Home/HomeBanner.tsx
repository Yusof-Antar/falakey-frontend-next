"use client";
import Link from "next/link";
import { Type } from "@/models/type";
const falakeyLogo = "/images/falakey-logo.svg";

import SearchInput from "../SearchInput";

import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
// import { Collection } from "@/models/collection";
// import { search } from "@/lib/slices/searchSlice";

const HomeBanner = ({
  slogan,
  author,
  authorSlug,
  categoryVar,
  homeImage,
  typeOptions,
  bannerPosition,
}: // collections,
{
  slogan: string;
  author: string;
  authorSlug: string;
  categoryVar?: string;
  homeImage?: string;
  typeOptions: Type[];
  bannerPosition?: string;
  // collections: Collection[];
}) => {
  const { t } = useTrans();

  // const dispatch = useDispatch();

  const { local } = useSelector((state: RootState) => state.translation);
  // const previousSearch = useSelector((state: RootState) => state.search);

  return (
    <>
      <div
        className="lg:flex-1 max-lg:h-full rounded-3xl overflow-hidden relative bg-cover  flex flex-col justify-between p-6 "
        style={{
          // backgroundImage: `url(${homeImage})`,
          alignItems: `${local == "ar" ? "end" : "start"}`,
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0) 70%), url(${homeImage})`,
          backgroundPosition: bannerPosition,
        }}
      >
        <img
          src={falakeyLogo}
          className="h-[37px] w-fit object-contain object-left "
          style={{ width: "fit-content" }}
          alt="Flakey Logo"
        />
        <div className="flex flex-col w-full">
          <h1 className="xl:text-4xl lg:text-3xl sm:text-2xl text-lg  font-bold leading-6 text-white">
            {slogan}
          </h1>
          <div className="flex w-full justify-between ">
            <div className="w-[70%] xl:block hidden">
              <SearchInput categoryVar={categoryVar} options={typeOptions} />
            </div>
            <div className="flex justify-end text-start me-4">
              <Link
                href={`/${local}/@${authorSlug}`}
                className="font-semibold rounded-md flex items-center space-x-1 hover:text-blue-500"
              >
                <span className="text-gray-400/80 sm:text-md  text-[0.7rem]">
                  {t("home.photo_by")}{" "}
                </span>
                <span> </span>
                <span className="text-white text-xs text-[0.7rem]">
                  {author}
                </span>
              </Link>
            </div>
          </div>
          {/* <div className="text-white gap-2 xl:flex hidden">
            {collections.slice(1, 6).map((c) => (
              <div
                key={c.key}
                onClick={() => {
                  dispatch(
                    search({
                      ...previousSearch,
                      collection: c.key,
                    })
                  );
                }}
                className={`text-sm px-4 py-1 rounded-md border border-gray-400 cursor-pointer ${
                  c.key === previousSearch.collection
                    ? "bg-gray-600/40 border-none"
                    : ""
                }`}
              >
                {c.name}
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default HomeBanner;
