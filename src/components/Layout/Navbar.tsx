"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const starIcon = "/icons/star-icon.svg";

import {
  faBell,
  faMagnifyingGlass,
  // faUpload,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AuthenticationModal from "../Authentication/AuthenticationModal";
// import MenuIcon from "@mui/icons-material/Menu";
import dynamic from "next/dynamic";
const UploadModal = dynamic(() => import("../UploadModal"), { ssr: false });
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import DashboardModal from "../DashboardModal";
import ResponsiveMenuModal from "./ResponsiveMenuModal";
import FavoritesModal from "../FavoritesModal";
import { search } from "@/lib/slices/searchSlice";
import NotificationModal from "../NotificationModal";
import { Chat } from "@/models/Chat";
import { Notification } from "@/models/notification";
import { Badge } from "@mui/material";
import { useTrans } from "@/utils/translation";
import LanguageSelector from "../LanguageSelector";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";
import { apiRequest } from "@/utils/apiRequest";
import MobileNavbarInputSearch from "./MobileNavbarInputSearch";
import { useHomeHook } from "@/helper/homeHook";
import ProfileNavbarModal from "./ProfileNavbarModal";
import { MenuIcon, XIcon } from "lucide-react";
// import { XIcon } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [openDashboardModal, setOpenDashboardModal] = useState(false);
  const [openProfileNavbarModal, setOpenProfileNavbarModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [openResponsiveMenu, setOpenResponsiveMenu] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showMobileSearchModal, setShowMobileSearchModal] = useState(false);

  const navigate = useNavigateWithLocale();

  const { user, isLoggedIn, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const { getHomeData, data } = useHomeHook();

  const previousearchData = useSelector((state: RootState) => state.search);
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState<number>(0);
  const [chats, setChats] = useState<Chat[]>([]);

  const isImageGeneratorPage = pathname.includes("image-generator");

  const [searchValue, setSearchValue] = useState(previousearchData.search);

  const { t } = useTrans();

  useEffect(() => {
    getHomeData();
  }, []);

  useEffect(() => {
    const isHomePage = ["/", "/en", "/ar"].includes(
      pathname.replace(/\/+$/, ""),
    );
    if (isHomePage) setSearchValue("");
  }, [pathname]);

  useEffect(() => {
    if (
      openAuthModal ||
      openUploadModal ||
      showFavoritesModal ||
      openNotificationModal ||
      showMobileSearchModal
    ) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [
    openAuthModal,
    openUploadModal,
    showFavoritesModal,
    openNotificationModal,
    showMobileSearchModal,
  ]);

  const handleSearchEvent = useCallback(() => {
    const value = searchValue !== "" ? searchValue : (previousearchData.search ?? "");
    setSearchValue(value);
    dispatch(
      search({ ...previousearchData, collection: null, search: value }),
    );
  }, [searchValue, previousearchData, dispatch]);

  useEffect(() => {
    if (!user && openUploadModal) {
      setOpenUploadModal(false);
      setSignUp(false);
      setOpenAuthModal(true);
    }
  }, [openUploadModal]);

  const handleUploadNavigate = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/upload");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      apiRequest({
        method: "GET",
        url: "notifications",
        withLocale: true,
        token: token!,
      }).then((result) => {
        if (result["success"]) {
          setNotifications(result["data"]["data"]["notifications"]["list"]);
          setChats(result["data"]["data"]["chats"]["list"]);
          setUnread(
            result["data"]["data"]["notifications"]["unread_count"] +
              result["data"]["data"]["chats"]["unread_count"],
          );
        }
      });
    }
  }, [isLoggedIn]);

  const { local } = useSelector((state: RootState) => state.translation);

  return (
    <>
      {showFavoritesModal && (
        <FavoritesModal
          showFavoritesModal={showFavoritesModal}
          showModal={(visible) => {
            setShowFavoritesModal(visible);
          }}
        />
      )}
      {openAuthModal && (
        <AuthenticationModal
          modalHandler={setOpenAuthModal}
          signUpBool={signUp}
        />
      )}

      {openUploadModal && user && (
        <UploadModal modalHandler={setOpenUploadModal} />
      )}

      <nav
        className={`h-[70px] fixed z-20 w-screen flex py-3 px-5 gap-4 items-center border-b-2
        ${
          isImageGeneratorPage
            ? "bg-primary text-white border-white/20"
            : "bg-white text-[#767676] "
        } 
      `}
      >
        {!showMobileSearchModal ? (
          <>
            {/* Logo */}
            <a
              href={`/${local}?types=photo`}
              className="flex-shrink-0 h-full flex items-center"
            >
              <Image
                src={starIcon}
                alt="Star Icon"
                className="size-[35px]"
                width={100}
                height={100}
              />
              {/* <Image src={falakeyLogo} alt="Star Icon" className="flex object-center lg:hidden h-[80%]" width={100} height={100} /> */}
            </a>

            {/* Desktop Layout */}
            <nav className="hidden lg:flex flex-1 items-center gap-6">
              {/* Search Bar */}
              <div className="rounded-full bg-custom-light-gray flex flex-1 gap-2 items-center px-4 h-10">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-[#767676] cursor-pointer"
                  onClick={() => {
                    handleSearchEvent();
                    navigate(
                      `/explore?types=${
                        previousearchData.types ?? "photo"
                      }&search=${encodeURIComponent(searchValue ?? "")}`,
                    );
                  }}
                />
                <input
                  type="search"
                  enterKeyHint="search"
                  className="w-full bg-transparent h-full focus-within:outline-none font-bold"
                  placeholder={
                    previousearchData.placeholder || t("navbar.search_photo")
                  }
                  value={searchValue ?? ""}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter") {
                      handleSearchEvent();
                      navigate(
                        `/explore?types=${
                          previousearchData.types ?? "photo"
                        }&search=${encodeURIComponent(searchValue ?? "")}`,
                      );
                    }
                  }}
                />
              </div>

              {/* Desktop Right Section */}
              <div className="flex items-center gap-6 font-bold text-md">
                <Link href="#" className="text-gray-400 cursor-default">
                  {t("navbar.advertise")}
                </Link>
                <Link
                  href={`/${local}/explore?types=${
                    previousearchData.types
                  }&search=${encodeURIComponent(searchValue ?? "")}`}
                  onClick={() => {
                    handleSearchEvent();
                  }}
                  className="cursor-pointer"
                >
                  {t("navbar.explore")}
                </Link>
                <button
                  onClick={() => {}}
                  disabled
                  className="bg-gray-400 px-3 py-1 text-white rounded-full"
                >
                  {t("navbar.pckg_price")}
                </button>
                <div className="h-7.5 w-0.5 bg-gray-300"></div>
                <LanguageSelector />

                {isLoggedIn ? (
                  <div className="flex items-center gap-4 cursor-pointer">
                    <div
                      className="flex cursor-pointer items-center justify-center text-[23px]"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setOpenNotificationModal((prev) => !prev);
                      }}
                    >
                      <Badge
                        badgeContent={unread}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "#44175b",
                            color: "white",
                          },
                        }}
                      >
                        <FontAwesomeIcon icon={faBell} />
                      </Badge>
                    </div>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        setOpenDashboardModal((prev) => !prev);
                      }}
                    >
                      <div className="bg-custom-gray rounded-full h-7.5 w-7.5 flex justify-center items-center">
                        <img
                          src={user!.avatar}
                          alt={user?.display_name}
                          className="rounded-full object-cover h-full w-full"
                        />
                      </div>
                      <div>{user!.display_name}</div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setSignUp(false);
                      setOpenAuthModal(!openAuthModal);
                    }}
                    className="cursor-pointer bg-primary hover:bg-white border-[1.5px] hover:text-gray-400 text-white hover:border-gray-300 rounded-lg shadow-sm items-center justify-center flex px-4 py-1"
                  >
                    {t("navbar.join")}
                  </div>
                )}
                <button
                  onClick={() => handleUploadNavigate()}
                  className="submit-button border-[1.5px] border-gray-300 rounded-lg shadow-sm py-1 px-3"
                >
                  {t("navbar.image_submit")}
                </button>
              </div>
            </nav>

            {/* Mobile Layout - Falakey Style */}
            <nav className="flex lg:hidden flex-1 items-center justify-end gap-1 text-xl ">
              {/* Search Icon */}
              <div className="rounded-full bg-custom-light-gray flex flex-1 gap-2 items-center px-4 h-10">
                <FontAwesomeIcon
                  icon={faMagnifyingGlass}
                  className="text-[#767676] cursor-pointer"
                  onClick={() => {
                    handleSearchEvent();
                    navigate(
                      `/explore?types=${
                        previousearchData.types ?? "photo"
                      }&search=${encodeURIComponent(searchValue ?? "")}`,
                    );
                  }}
                />
                <input
                  type="search"
                  enterKeyHint="search"
                  className="w-full text-[16px] bg-transparent h-full focus-within:outline-none font-bold"
                  placeholder={
                    previousearchData.placeholder || t("navbar.search_photo")
                  }
                  value={searchValue ?? ""}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  onKeyDown={(e: any) => {
                    if (e.key === "Enter" && searchValue!.trim() !== "") {
                      handleSearchEvent();
                      navigate(
                        `/explore?types=${
                          previousearchData.types ?? "photo"
                        }&search=${encodeURIComponent(searchValue ?? "")}`,
                      );
                    }
                  }}
                />
              </div>

              {/* If Logged In: Notification + Profile */}
              {isLoggedIn ? (
                <>
                  {/* Notification Icon */}

                  <button
                    onClick={() => handleUploadNavigate()}
                    className="flex bg-primary text-[15px] text-white items-center justify-center  p-1 px-4 ms-2 rounded-lg "
                  >
                    {t("navbar.upload")}
                  </button>
                  {/* Profile */}
                  {/* <div
                    className="flex items-center justify-center cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      setOpenResponsiveMenu((prev) => !prev);
                    }}
                  >
                    <div className="bg-custom-gray rounded-full size-[40px] flex justify-center items-center">
                      <img
                        src={user!.avatar}
                        alt={user?.display_name}
                        className="rounded-full object-cover h-full w-full"
                      />
                    </div>
                  </div> */}
                </>
              ) : (
                /* If Not Logged In: Join Button */
                <button
                  onClick={() => {
                    setSignUp(false);
                    setOpenAuthModal(!openAuthModal);
                  }}
                  className="cursor-pointer bg-primary hover:bg-white border-[1.5px] hover:text-gray-400 text-white hover:border-gray-300 rounded-lg shadow-sm items-center justify-center flex px-4 py-1"
                >
                  {t("navbar.join")}
                </button>
              )}

              {/* Hamburger Menu */}
              <div
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setOpenResponsiveMenu((prev) => !prev);
                }}
                className="flex items-center justify-center ms-1 rounded-lg cursor-pointer"
              >
                {openResponsiveMenu ? <XIcon /> : <MenuIcon />}
              </div>
            </nav>
            {openDashboardModal && (
              <DashboardModal
                openModal={openDashboardModal}
                modalHandler={setOpenDashboardModal}
                showFavoritesModal={(b: boolean) => {
                  setShowFavoritesModal(b);
                  setOpenDashboardModal(false);
                }}
              />
            )}
            <ResponsiveMenuModal
              openModal={openResponsiveMenu}
              modalHandler={(b: boolean) => setOpenResponsiveMenu(b)}
              showFavoritesModal={(b: boolean) => {
                setShowFavoritesModal(b);
                setOpenResponsiveMenu(false);
              }}
              uploadImageHandler={(b: boolean) => {
                setOpenUploadModal(b);
              }}
              loginHandler={(b: boolean) => {
                setSignUp(false);
                setOpenAuthModal(b);
              }}
              registerHandler={(b: boolean) => {
                setSignUp(true);
                setOpenAuthModal(b);
              }}
              socialLinks={data?.social_media}
            />
            {openProfileNavbarModal && (
              <ProfileNavbarModal
                openModal={openProfileNavbarModal}
                modalHandler={setOpenProfileNavbarModal}
                showFavoritesModal={(b: boolean) => {
                  setShowFavoritesModal(b);
                  setOpenDashboardModal(false);
                }}
              />
            )}
            {openNotificationModal && (
              <NotificationModal
                openModal={openNotificationModal}
                modalHandler={setOpenNotificationModal}
                chats={chats}
                notifications={notifications}
              />
            )}
          </>
        ) : (
          <MobileNavbarInputSearch
            options={data?.types ?? []}
            onClose={() => setShowMobileSearchModal(false)}
          />
        )}
      </nav>

      {/* Mobile Search Modal */}
    </>
  );
};

export default Navbar;
