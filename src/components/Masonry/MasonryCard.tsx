"use client";
import Image from "next/image";
import { Post } from "@/models/post";
import { faArrowDown, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import AvailableForHire from "../Common/AvailableForHire";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import MasonryProfileModal from "./MasonryProfileModal";
import React, { useEffect, useRef, useState } from "react";
import MessageModal from "../MessageModal";
import { useTrans } from "@/utils/translation";
import { fireConfettiAtClickPosition } from "@/helper/favoriteConfetti";
import { FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";
const logo = "/star-icon.svg";

const MasonryCard = ({
  data,
  handleClick,
  handleFavorite,
  handleAuthModal,
}: {
  data: Post;
  handleClick: () => void;
  handleFavorite: (id: number) => Promise<boolean>;
  handleAuthModal: () => void;
}) => {
  const [isFavorite, setIsFavorite] = useState(data.is_favorite ?? false);

  useEffect(() => {
    setIsFavorite(data.is_favorite ?? false);
  }, [data.is_favorite]);

  const navigate = useNavigateWithLocale();

  const [isModalOpen, setModalOpen] = useState(false);

  const [showProfileModal, setShowProfileModal] = useState(false);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [playing, setPlaying] = useState(false);

  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        // Ensure it's paused before playing (avoids race conditions)
        setPlaying(true);
        videoRef.current.pause();
        await videoRef.current.play();
      } catch {
        setPlaying(false);
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      setPlaying(false);
      videoRef.current.pause();
    }
  };

  const { t } = useTrans();
  const { local } = useSelector((state: RootState) => state.translation);

  return (
    <>
      {isModalOpen && (
        <MessageModal
          peerId={data.author?.id}
          postId={data.id}
          showModal={setModalOpen}
        />
      )}
      <div className="w-full  overflow-visible">
        <div
          className="relative w-full"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* {data.author && (
              <a
                href={`/@${data.author?.username}`}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (e.ctrlKey || e.metaKey) {
                    window.open(
                      `/${local}/@${data.author?.username}`,
                      "_blank"
                    );
                  } else {
                    navigate("/@" + data.author?.username);
                  }
                }}
                className="flex gap-2 items-center justify-start mb-3 xl:hidden relative"
              >
                {data.author ? (
                  <img
                    src={data.author.avatar}
                    alt={data.author.display_name}
                    className="rounded-full object-cover size-[37.5px] bg-primary"
                  />
                ) : (
                  <div className="rounded-full bg-primary text-white size-[37.5px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div className="text-start">
                  <div className="text-md font-normal">
                    {data.author?.display_name}
                  </div>
                  <AvailableForHire
                    available={data?.author?.available_for_hire ?? false}
                    username={data?.author?.username}
                  />
                </div>
              </a>
            )} */}
          <div
            // href={`/${local}/${data.type}/${data.slug}`}
            // target="_blank"
            className="relative rounded-3xl overflow-hidden"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (e.ctrlKey || e.metaKey) {
                window.open(`/${local}/${data.type}/${data.slug}`, "_blank");
              } else {
                handleClick();
              }
            }}
          >
            {data.type == "video" ? (
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  width: "100%",
                  aspectRatio: data.aspect_ratio,
                  backgroundColor: data.dominant_color,
                }}
              >
                <div className="absolute inset-0 bg-black/35 rounded-xl flex items-center justify-center">
                  <PlayCircleOutlineIcon className="!text-6xl text-white" />
                </div>

                <video
                  style={{
                    width: "100%",

                    backgroundColor: data.dominant_color,
                  }}
                  muted
                  playsInline
                  ref={videoRef}
                  preload="metadata"
                  poster={playing ? undefined : data.thumbnails?.thumb}
                  className={`w-full h-full object-cover cursor-pointer rounded-xl overflow-hidden`}
                >
                  <source
                    style={{
                      width: "100%",

                      backgroundColor: data.dominant_color,
                    }}
                    src={
                      data.preview_links?.thumb ??
                      data.preview_links?.sm ??
                      data.preview_links?.md
                    }
                    type=""
                  />
                </video>
              </div>
            ) : (
              <>
                <img
                  src={data.preview_links?.sm ?? data.preview_links?.md}
                  alt={data.title}
                  className={`${
                    data.type == "icon" ? "p-3" : ""
                  } bg-opacity-30 rounded-xl object-cover cursor-pointer `}
                  loading="lazy"
                  style={{
                    width: "100%",
                    // minHeight: `${
                    //   data.aspect_ratio
                    //     ? data.type == "photo"
                    //       ? 250 / data.aspect_ratio + "px"
                    //       : 200 / data.aspect_ratio + "px"
                    //     : "300px"
                    // }`,
                    aspectRatio: data.aspect_ratio,
                    backgroundColor: data.dominant_color ?? "#ccc",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </>
            )}
            {data.is_premium ? (
              <div className="absolute w-fit flex items-center gap-1.5 top-2 start-2 bg-primary/60 text-white px-2 py-1 rounded-md text-xs font-bold">
                <Image
                  src={logo}
                  className="size-[15px] object-cover"
                  alt=""
                  width={100}
                  height={100}
                />
                {t("post.premium")}
              </div>
            ) : null}
          </div>
          {/* <div className="flex mt-1 justify-between items-center xl:hidden">
              <div
                className="lg:h-[50px] md:h-[45px] h-[40px]  cursor-pointer w-fit   bg-gray-50 px-2 py-2 border-gray-200 border text-gray-500 rounded-lg shadow-md flex gap-2 justify-start items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (!isLoggedIn) {
                    handleAuthModal();
                  } else {
                    handleFavorite(data.id).then((result) => {
                      if (result) {
                        if (!isFavorite)
                          fireConfettiAtClickPosition(e.clientX, e.clientY);
                        setIsFavorite(!isFavorite);
                      }
                    });
                  }
                }}
              >
                <motion.div
                  initial={isFavorite}
                  animate={
                    isFavorite
                      ? { scale: [1, 1.2, 0.85, 1], color: "#ef4444" }
                      : { scale: 1, color: "#9ca3af" }
                  }
                  transition={{ duration: 0.5 }}
                  className={`text-2xl`}
                >
                  <FaHeart />
                </motion.div>
                {data.favorites_count}
              </div>
              {data.is_download_locked ? (
                <div className="lg:h-[50px] md:h-[45px] h-[40px] w-fit flex cursor-pointer px-2 gap-2 justify-between shadow-md rounded-md  items-center my-2 bg-gray-50 border-gray-200 border text-gray-500 ">
                  <div className="text-center lg:text-lg md:text-md text-sm  ">
                    {t("masonry.download")}
                  </div>
                  <FontAwesomeIcon icon={faLock} />
                </div>
              ) : data.is_premium ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.ctrlKey || e.metaKey) {
                      window.open(`/${local}/${data.type}/${data.slug}`, "_blank");
                    } else {
                      handleClick();
                    }
                  }}
                  className="lg:h-[50px] md:h-[45px] h-[40px] px-4 my-2 gap-2 flex bg-yellow-500 text-white rounded-md items-center justify-center transition hover:bg-yellow-600 font-semibold text-sm"
                  title={`${t("post.premium")} - ${
                    data.premium_credits ?? 0
                  } credits`}
                >
                  <Image src={logo} className="size-[20px]" alt="" width={100} height={100} />
                  <p>{t("post.premium")}</p>
                </button>
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (e.ctrlKey || e.metaKey) {
                      window.open(`/${local}/${data.type}/${data.slug}`, "_blank");
                    } else {
                      handleClick();
                    }
                  }}
                  className="lg:h-[50px] md:h-[45px] h-[40px]  w-fit flex cursor-pointer px-2 gap-2 justify-between shadow-md rounded-md  items-center my-2 bg-gray-50 border-gray-200 border text-gray-500 "
                >
                  <div className="text-center lg:text-lg md:text-md text-sm  ">
                    {t("masonry.download")}
                  </div>
                  <FontAwesomeIcon icon={faArrowDown} />
                </div>
              )}
            </div> */}

          <div
            // href={`/${data.type}/${data.slug}`}
            // target="_blank"
            className={`${
              data.type != "video"
                ? " bg-gradient-to-t from-black/75 to-[40%] to-transparent"
                : ""
            } cursor-pointer absolute rounded-xl right-0 left-0 top-0 bottom-0 w-full h-full xl:hover:opacity-100 xl:hover:ease-in xl:opacity-0 transition-opacity ease-out duration-200 `}
            onMouseEnter={() => {
              handlePlay();
            }}
            onMouseLeave={() => {
              handlePause();
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (e.ctrlKey || e.metaKey) {
                window.open(`/${local}/${data.type}/${data.slug}`, "_blank");
              } else {
                handleClick();
              }
            }}
          >
            <div className="flex flex-col justify-between h-full text-white py-3 px-4 z-20">
              <div className="xl:flex hidden justify-end items-center">
                <div
                  className="flex gap-2 max-h-[40px] justify-start  items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    if (!isLoggedIn) {
                      handleAuthModal();
                    } else {
                      handleFavorite(data.id).then((result) => {
                        if (result) {
                          if (!isFavorite)
                            fireConfettiAtClickPosition(e.clientX, e.clientY);
                          setIsFavorite(!isFavorite);
                        }
                      });
                    }
                  }}
                >
                  <motion.div
                    initial={isFavorite}
                    animate={
                      isFavorite
                        ? { scale: [1, 1.2, 0.85, 1], color: "#ef4444" }
                        : { scale: 1, color: "#9ca3af" }
                    }
                    transition={{ duration: 0.5 }}
                    className={`text-2xl`}
                  >
                    <FaHeart />
                  </motion.div>
                  {data.favorites_count}
                </div>
              </div>
              <div className="xl:hidden flex justify-end items-center mt-auto relative">
                {data.is_download_locked ? (
                  <div className="rounded-full bg-black/60 text-white size-[35px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                ) : (
                  <div className="rounded-full bg-black/60 text-white size-[35px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                )}
              </div>
              <div className="xl:flex hidden justify-between items-center mt-auto relative">
                {data.author && (
                  <div
                    className="flex gap-2 items-center justify-center cursor-pointer"
                    onMouseEnter={() => {
                      setShowProfileModal(true);
                    }}
                    onMouseLeave={() => {
                      setShowProfileModal(false);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      if (e.ctrlKey || e.metaKey) {
                        window.open(
                          `/${local}/@${data.author?.username}`,
                          "_blank",
                        );
                      } else {
                        navigate("/@" + data.author?.username);
                      }
                    }}
                  >
                    {showProfileModal && (
                      <MasonryProfileModal
                        handleShowProfile={(b: boolean) => {
                          setShowProfileModal(b);
                        }}
                        handleShowModal={(b: boolean) => {
                          setModalOpen(b);
                        }}
                        user={data.author}
                      />
                    )}

                    {data.author ? (
                      <img
                        src={data.author.avatar}
                        alt={data.author.display_name}
                        className="rounded-full object-cover size-[37.5px] bg-primary"
                      />
                    ) : (
                      <div className="rounded-full bg-primary text-white size-[37.5px] flex justify-center items-center">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}

                    <div className="text-start">
                      <div className="text-md font-normal">
                        {data.author?.display_name}
                      </div>
                      <AvailableForHire
                        available={data?.author?.available_for_hire ?? false}
                        username={data?.author?.username}
                        gray
                      />
                    </div>
                  </div>
                )}
                {data.is_download_locked ? (
                  <div className="rounded-full bg-black/60 text-white size-[35px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                ) : (
                  <div className="rounded-full bg-black/60 text-white size-[35px] flex justify-center items-center">
                    <FontAwesomeIcon icon={faArrowDown} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MasonryCard;
