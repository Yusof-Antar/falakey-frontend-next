"use client";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DownloadIcon from "@mui/icons-material/Download";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import SideBarLink from "./SideBarLink";
import { usePathname } from "next/navigation";
import { useTrans } from "@/utils/translation";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";

const SideBar = () => {
  const pathname = usePathname();
  const [hoverState, setHoverState] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  const menuItems = [
    { label: t("sidebar.dashboard"), path: `/${local}/my-account` },
    { label: t("sidebar.listings"), path: `/${local}/my-account/listings` },
    { label: t("sidebar.downloads"), path: `/${local}/my-account/downloads` },
    { label: t("sidebar.messages"), path: `/${local}/my-account/messages` },
    {
      label: t("sidebar.notifications"),
      path: `/${local}/my-account/notification`,
    },
    {
      label: t("sidebar.account_details"),
      path: `/${local}/my-account/account-details`,
    },
  ];

  const handleNavigate = (path: string) => {
    window.location.href = path;
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className="lg:hidden block pt-[70px] mt-2 px-4 pb-4 w-[90%]">
        <div
          onClick={() => setMobileMenuOpen(true)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-800 font-medium text-sm cursor-pointer shadow-sm hover:border-gray-300 transition-colors flex items-center justify-between"
        >
          <span>{menuItems.find((m) => pathname === m.path)?.label}</span>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transition-all duration-300 transform ${
          mobileMenuOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {t("sidebar.menu")}
            </h3>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => handleNavigate(item.path)}
                className={`w-full px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                  pathname === item.path
                    ? "bg-primary text-white shadow-md"
                    : "bg-gray-50 text-gray-800 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div
              onClick={handleLogout}
              className="w-full px-4 py-3 rounded-lg font-medium text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-all cursor-pointer"
            >
              {t("sidebar.logout")}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex hidden fixed left-0 top-[70px] bottom-0 w-[60px] bg-white flex-col items-center justify-start py-6 shadow-md gap-6 z-10">
        <SideBarLink
          title={t("sidebar.dashboard")}
          route={`/${local}/my-account`}
          element={<DashboardIcon className="!text-[20px]" />}
        />
        <SideBarLink
          title={t("sidebar.listings")}
          route={`/${local}/my-account/listings`}
          element={<LocationOnIcon className="!text-[20px]" />}
        />
        <SideBarLink
          title={t("sidebar.downloads")}
          route={`/${local}/my-account/downloads`}
          element={<DownloadIcon className="!text-[20px]" />}
        />
        <SideBarLink
          title={t("sidebar.messages")}
          route={`/${local}/my-account/messages`}
          element={<MessageIcon className="!text-[20px]" />}
        />
        <SideBarLink
          title={t("sidebar.notifications")}
          route={`/${local}/my-account/notification`}
          element={<NotificationsIcon className="!text-[20px]" />}
        />
        <SideBarLink
          title={t("sidebar.account_details")}
          route={`/${local}/my-account/account-details`}
          element={<i className="fa-solid fa-user !text-[15px]" />}
        />
        <div
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
          className="w-full relative flex items-center justify-center bg-white"
        >
          <LockIcon className="!text-[20px] !text-[#d55252]" />
          <div
            style={{ width: "max-content" }}
            className={`absolute -z-50 ${hoverState ? "left-[60px]" : "left-0 opacity-0"} top-0 bottom-0 transition-all duration-300 text-[14px] font-semibold rounded-r-md px-4 min-w-fit bg-black text-white flex items-center justify-center`}
          >
            {t("sidebar.logout")}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
