'use client';
import { Sponsor } from "@/models/challenge";
import { useTrans } from "@/utils/translation";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";

const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
  console.log(sponsor);

  const { t } = useTrans();
  return (
    <div
      onClick={() => {
        if (sponsor.link) {
          window.open(sponsor.link, "_blank");
        }
      }}
      className={`challenge-deadline  my-[15px] flex gap-[10px] items-start ${
        sponsor.link ? "cursor-pointer" : ""
      }`}
    >
      <div className="deadline-calender max-w-[100px] min-w-[48px] h-[48px] border-[1px] border-[#dfdfe0] overflow-clip flex flex-col rounded-lg items-center justify-center py-0 leading-none">
        {sponsor.logo ? (
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            className="size-full object-cover"
          />
        ) : (
          <SellOutlinedIcon className="!text-gray-600" />
        )}
      </div>
      <div className="submission h-fit text-start flex flex-col">
        <span>{t("challenge.sponsored_by")}</span>
        <span className="text-start font-semibold">
          <p>{sponsor.name}</p>
        </span>
      </div>
    </div>
  );
};

export default SponsorCard;
