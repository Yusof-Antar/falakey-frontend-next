"use client";
import type { RootState } from "@/types/RootState";
import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const Footer = () => {
  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);
  const pathname = usePathname();
  const isImageGeneratorPage = pathname.includes("image-generator");
  return (
    <footer
      className={`${
        isImageGeneratorPage
          ? "bg-[#7a3470] text-white border-white/20"
          : "bg-white text-[#767676] "
      }   w-full border-t-2 h-[70px]`}
    >
      <div className="flex h-full justify-center">
        <div className="mt-12 mx-3 mb-4 flex  md:flex-row flex-col gap-6 sm:justify-between justify-center items-center w-size text-sm font-semibold ">
          <div className="flex gap-5 ">
            <div>{t("footer.about_us")}</div>
            <div>
              <a href={`/${local}/license`}>{t("footer.content_license")}</a>
            </div>
          </div>
          <div>
            {t("footer.copy_right")} {new Date().getFullYear()}.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
