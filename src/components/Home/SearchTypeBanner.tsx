"use client";
import { usePathname } from "next/navigation";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";
import { search } from "@/lib/slices/searchSlice";
import { RootState } from "@/lib/store";
import { Type } from "@/models/type";
import { useTrans } from "@/utils/translation";
import { useDispatch, useSelector } from "react-redux";
import AuthenticationModal from "../Authentication/AuthenticationModal";
import { useState } from "react";

const SearchTypeBanner = ({
  types,
  handleScrollToMasonry,
}: {
  types: Type[];
  handleScrollToMasonry: () => void;
}) => {
  const { t: trans } = useTrans();
  const navigate = useNavigateWithLocale();

  const [openAuthModal, setOpenAuthModal] = useState(false);

  const dispatch = useDispatch();
  const previousSearch = useSelector((state: RootState) => state.search);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <>
      {openAuthModal && <AuthenticationModal modalHandler={setOpenAuthModal} />}
      <div className="flex-1 flex justify-between w-full p-1.5 gap-3  h-full lg:min-h-[90px] min-h-[70px] bg-tertiary rounded-2xl">
        {types.map((t) => (
          <div
            key={t.key}
            onClick={() => {
              if (t.key != "video") {
                handleScrollToMasonry();
                dispatch(
                  search({
                    ...previousSearch,
                    types: t.key,
                    placeholder: t.search_placeholder,
                  }),
                );
                const params = new URLSearchParams(window.location.search);
                params.set("types", t.key);

                const newUrl =
                  window.location.pathname +
                  "?" +
                  params.toString() +
                  window.location.hash;

                window.history.replaceState({}, "", newUrl);
              }
            }}
            className={`${
              previousSearch.types === t.key
                ? "bg-primary text-white fill-white"
                : ""
            } lg:text-lg text-md font-bold flex-1 rounded-xl flex flex-col justify-center items-center ${
              t.key != "video"
                ? "cursor-pointer text-gray-600"
                : "text-gray-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="md:size-[20px] size-[18px] bg-current"
                style={{
                  maskImage: `url(./icons/${t.key}s.svg)`,
                  WebkitMaskImage: `url(./icons/${t.key}s.svg)`,
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  maskSize: "contain",
                }}
              />
              <span className="relative font-franklin">{t.name}</span>
            </div>

            {t.key == "video" && (
              <span className=" font-franklin md:top-6 top-[80%] end-[50%]  md:text-sm text-xs ">
                {trans("common.soon")}
              </span>
            )}
          </div>
        ))}
        <div
          onClick={() => {
            if (!user) {
              setOpenAuthModal(true);
            } else {
              navigate("/falakey-ai");
            }
          }}
          className={`${
            previousSearch.types === "ai" ? "bg-primary text-white" : ""
          } lg:text-lg text-md font-bold text-gray-600 flex-1 rounded-2xl flex gap-1 justify-center items-center cursor-pointer`}
        >
          <img
            src={`./icons/ai.svg`}
            className="md:size-[24px] size-[20px] "
            alt=""
          />
          <span className="relative font-franklin flex  text-center  flex-col justify-center items-center">
            {trans("common.ai_suite")}
          </span>
        </div>
      </div>
    </>
  );
};

export default SearchTypeBanner;
