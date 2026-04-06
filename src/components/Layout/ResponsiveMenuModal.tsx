"use client";
import Link from "next/link";
import { useRef, useEffect } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MessageIcon from "@mui/icons-material/Message";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StyleIcon from "@mui/icons-material/Style";
import LockIcon from "@mui/icons-material/Lock";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/lib/slices/authSlice";
import { RootState } from "@/lib/store";
import { useTrans } from "@/utils/translation";
import LanguageSelector from "../LanguageSelector";
import { Coins } from "lucide-react";

const ResponsiveMenuModal = ({
  openModal,
  modalHandler,
  showFavoritesModal,
  uploadImageHandler,
  loginHandler,
  registerHandler,
  socialLinks,
}: {
  openModal: boolean;
  modalHandler: (b: boolean) => void;
  showFavoritesModal: (b: boolean) => void;
  uploadImageHandler: (b: boolean) => void;
  loginHandler: (b: boolean) => void;
  registerHandler: (b: boolean) => void;
  socialLinks?: { platform: string; icon: string; link: string }[];
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { local } = useSelector((state: RootState) => state.translation);
  const { t } = useTrans();

  /* -------- Close on outside click (desktop only) -------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        modalHandler(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalHandler]);

  return (
    <div
      ref={modalRef}
      className={`
    ${openModal ? "translate-x-0" : "-translate-x-full "}
    transition-transform duration-300 ease-in-out

    /* Desktop dropdown */
    lg:hidden
    lg:absolute lg:end-2 lg:start-2 lg:top-full lg:mt-2 lg:max-w-72 lg:translate-y-0

    /* Mobile bottom sheet */
    fixed bottom-0 left-0 right-0
    h-full max-h-[calc(100dvh-69px)] w-full lg:h-auto 

    z-50 bg-white border border-gray-300 shadow-xl
    lg:rounded-t-2xl lg:rounded-lg

    pt-5 pb-4 !text-md font-semibold space-y-2
    overflow-y-auto
    text-[#767676]
  `}
    >
      {isLoggedIn ? (
        <>
          <Link
            href={`/${local}/my-account`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <DashboardIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.dashboard")}
          </Link>

          <Link
            href={`/${local}/my-account/messages`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <MessageIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.messages")}
          </Link>

          <Link
            href={`/${local}/my-account/notification`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <NotificationImportantIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.notifications")}
          </Link>

          <div
            className="hover:text-primary flex items-center gap-3 text-lg px-5 cursor-pointer"
            onClick={() => showFavoritesModal(true)}
          >
            <FavoriteIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.favorites")}
          </div>

          <div className="h-px bg-gray-300 my-2" />
        </>
      ) : (
        <LanguageSelector />
      )}

      {isLoggedIn ? (
        <>
          <LanguageSelector />
          <Link
            href={`/${local}/my-account/listings`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <LocationOnIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.listings")}
          </Link>
        </>
      ) : (
        <div className="space-y-2">
          <Link
            href={`/${local}/explore`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <MessageIcon className="!text-[18px] w-[20px]" />
            {t("navbar.explore")}
          </Link>
        </div>
      )}

      <div className="h-px bg-gray-300 my-2" />

      {isLoggedIn ? (
        <>
          {/* <Link
            href={`/${local}/my-account/plans`}
            
            onClick={() => {
              modalHandler(false);
            }}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <Coins className="!text-[18px] w-[20px]" />
            {t("navbar.pckg_price")}
          </Link> */}
          <button
            // href={`/${local}/my-account/plans`}
            disabled
            onClick={() => {
              modalHandler(false);
            }}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <Coins className="!text-[18px] w-[20px]" />
            {t("navbar.pckg_price")}
          </button>
          <Link
            href={`/${local}/my-account/account-details`}
            onClick={() => modalHandler(false)}
            className="hover:text-primary flex items-center gap-3 text-lg px-5"
          >
            <StyleIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.account_details")}
          </Link>

          <div
            className="hover:text-primary flex items-center gap-3 text-lg px-5 cursor-pointer"
            onClick={() => dispatch(logout())}
          >
            <LockIcon className="!text-[18px] w-[20px]" />
            {t("sidebar.logout")}
          </div>
        </>
      ) : (
        <div className="py-4 flex flex-col items-center gap-3">
          <div className="flex gap-2 w-full px-4 justify-center">
            <button
              onClick={() => uploadImageHandler(true)}
              className="submit-button border border-gray-300 rounded-lg px-3 py-1"
            >
              {t("sidebar.image_submit")}
            </button>
            <button
              onClick={() => loginHandler(true)}
              className="submit-button border border-gray-300 rounded-lg px-3 py-1"
            >
              {t("authentication.login")}
            </button>
          </div>

          <div onClick={() => registerHandler(true)}>
            {t("authentication.new_falakey")}{" "}
            <span className="underline">
              {t("authentication.sign_up_free")}
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-evenly text-3xl py-4">
        {socialLinks &&
          socialLinks.map((s, index) => (
            <a
              key={index}
              href={s.link}
              target="_blank"
              className={`${s.icon} cursor-pointer hover:text-primary`}
            />
          ))}
      </div>
    </div>
  );
};

export default ResponsiveMenuModal;
