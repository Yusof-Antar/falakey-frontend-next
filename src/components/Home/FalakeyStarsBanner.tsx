"use client";

const starIcon = "/icons/star-icon.svg";
const unkownProfile = "/images/unkown-profile.png";
import { LeaderBoardUser } from "@/models/leaderBoardUser";
import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useNavigateWithLocale } from "@/src/helper/navigateWithLocale";

const FalakeyStarsBanner = ({
  leaderBoardUser,
}: {
  leaderBoardUser: LeaderBoardUser[];
}) => {
  const navigate = useNavigateWithLocale();
  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  return (
    <div className="h-full lg:w-fit w-full lg:min-w-[320px] bg-tertiary rounded-3xl sm:p-8 p-2 pt-4 pb-6 overflow-hidden  flex flex-col items-center ">
      <div className="text-primary w-[95%] flex justify-between items-center gap-3 2xl:text-[26px] xl:text-xl md:text-xl sm:text-sm xs:text-md text-lg font-extrabold   sm:pb-2 ">
        {t("stars.falakey_stars")}
        <a
          className="text-gray-400 text-[13px] underline"
          href={`/${local}/falakey-stars`}
        >
          {t("stars.see_all")}
        </a>
      </div>
      <div className="overflow-x-hidden h-full overflow-y-auto scrollbar-hide w-full">
        <table className="h-full flex flex-col  max-lg:justify-start justify-center w-full">
          <tbody>
            {leaderBoardUser.map((leader, index) => (
              <tr
                key={index}
                className="w-full  cursor-pointer items-center flex gap-10 md:h-[90px] md:max-h-[90px]"
                onClick={() => navigate(`/@${leader.author?.username}`)}
              >
                <td
                  className={`flex justify-between md:h-[90px] md:max-h-[90px]  items-center`}
                >
                  <div className="relative aspect-square sm:size-[55px] xs:size-[45px] size-[40px]">
                    <img
                      src={leader.author?.avatar ?? unkownProfile}
                      className="rounded-full object-cover aspect-square size-full"
                      alt={leader.author?.display_name}
                    />
                    <div className="absolute top-0 start-0 sm:rtl:-translate-x-3/4 sm:translate-x-3/4 rtl:-translate-x-1/2 translate-x-1/2 -translate-y-1/3 size-[35px] ">
                      <div className="absolute text-white top-1/2 start-1/2 rtl:translate-x-1/2 -translate-x-1/2 -translate-y-1/2">
                        {leader.rank}
                      </div>
                      <img
                        src={starIcon}
                        alt="Star Icon"
                        className="size-full "
                      />
                    </div>
                  </div>
                </td>
                <td
                  className={`flex-1 flex flex-col items-start justify-center h-full relative`}
                >
                  <div className="!leading-4 text-primary sm:text-md xs:text-sm  text-[16px]  font-bold overflow-hidden">
                    {leader.author?.display_name}
                  </div>
                  <div className="sm:gap-1 gap-1 flex items-baseline">
                    <div className="text-secondary font-bold sm:text-2xl text-md ">
                      {leader.total_views_display}
                    </div>
                    <div className="text-primary font-bold sm:text-md text-xs ">
                      {t("stars.views")}
                    </div>
                  </div>
                  <div
                    className={` absolute bottom-0
                    ${
                      leaderBoardUser.length - 1 != index
                        ? "border-b-[1px] border-primary/55 w-full"
                        : ""
                    } `}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FalakeyStarsBanner;
