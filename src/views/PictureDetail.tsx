"use client";
import PictureDetailHeader from "@/components/PictureDetail/PictureDetailHeader";
import ProfileCard from "@/components/ProfileCard";

import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import MessageModal from "@/components/MessageModal";
import { toggleFavoritePost, useFetchPostDetail } from "@/helper/postHook";
import PageNotFound from "./PageNotFound";
import { ImageIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import SEO from "@/components/Common/SEO";
import { useTrans } from "@/utils/translation";
import AuthenticationModal from "@/components/Authentication/AuthenticationModal";
import { fireConfettiAtClickPosition } from "@/helper/favoriteConfetti";
import MasonryWrapper from "@/components/Masonry/MasonryWrapper";
import DownloadCard from "@/components/PictureDetail/DownloadCard";
import { DownloadData } from "@/models/post";
import posthog from "posthog-js";
import { useHomeHook } from "@/helper/homeHook";

const STATIC_ALLOWED_TYPES: string[] = ["listing"];

const PictureDetail = () => {
  const params = useParams();
  const pathname = usePathname();

  const picture = Array.isArray(params!.picture)
    ? params!.picture[0]
    : (params!.picture ?? "");

  const type = pathname!.split("/").filter(Boolean)[1];

  const [showMessageModal, setShowMessageModal] = useState(false);
  const {
    data: postDetail,
    loading: isLoading,
    error,
  } = useFetchPostDetail(picture!);

  const { data: homeData, loading: dataLoading, getHomeData } = useHomeHook();

  useEffect(() => {
    if (!homeData) {
      getHomeData();
    }
  }, []);

  // Combine dynamic types with static types
  const dynamicTypeKeys =
    homeData?.types?.map(
      (t: any) => t.key || t.slug || t.name?.toLowerCase(),
    ) || [];
  const allowedTypes = [
    ...new Set([...STATIC_ALLOWED_TYPES, ...dynamicTypeKeys]),
  ];

  // Validate type parameter
  const isValidType = type && allowedTypes.includes(type);

  const [selectedQuality, setSelectedQuality] = useState<DownloadData>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const loaded = useRef(false);
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (postDetail && !loaded.current) {
      setIsFavorite(postDetail.is_favorite ?? false);
      setFavoriteCount(postDetail.favorites_count ?? 0);
      setSelectedQuality(postDetail.download_data?.[0]);
      posthog.capture("post_view", {
        id: postDetail.id,
        slug: postDetail.slug,
        user_id: user?.id,
      });
      loaded.current = true;
    }
  }, [postDetail]);

  useEffect(() => {
    if (showMessageModal) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showMessageModal]);

  const handleFavorite = (e: any) => {
    toggleFavoritePost(postDetail!.id, token!).then((result) => {
      if (result) {
        setIsFavorite((prevData) => !prevData);
        setFavoriteCount((prevData) =>
          isFavorite ? prevData - 1 : prevData + 1,
        );
        if (!isFavorite) fireConfettiAtClickPosition(e.clientX, e.clientY);
      }
    });
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [openAuthModal, setOpenAuthModal] = useState(false);

  const { t } = useTrans();

  if (dataLoading) {
    return <Spinner />;
  }

  // Show PageNotFound if type is invalid
  if (!dataLoading && homeData && !isValidType) return <PageNotFound />;
  return (
    <>
      <SEO
        title={`Post | ${postDetail?.title || picture}`}
        description=""
        type="article"
        keywords={postDetail?.seo_keywords?.join(", ")}
        name="Falakey"
        image={postDetail?.preview_links?.original}
      />

      {openAuthModal && <AuthenticationModal modalHandler={setOpenAuthModal} />}

      <div className=" flex justify-center w-full my-4">
        {showMessageModal && (
          <MessageModal
            showModal={(b: boolean) => setShowMessageModal(b)}
            peerId={postDetail?.author?.id}
            postId={postDetail?.id}
          />
        )}
        {isLoading ? (
          <Spinner />
        ) : error ? (
          <PageNotFound />
        ) : (
          <div className="w-size space-y-6">
            <PictureDetailHeader
              post={postDetail!}
              favoriteCount={favoriteCount}
              isFavorite={isFavorite}
              toggleFavorite={(e: any) => {
                if (!isLoggedIn) {
                  setOpenAuthModal(true);
                } else {
                  handleFavorite(e);
                }
              }}
            />
            <div className="flex flex-col w-full lg:flex-row items-start gap-10 justify-center pt-4">
              <div className="w-full flex flex-col items-center flex-1">
                {postDetail?.type === "video" ? (
                  <video
                    controls
                    className="rounded-md w-full object-cover max-h-125"
                    style={{
                      aspectRatio: `${postDetail?.aspect_ratio || 1}`,
                      maxWidth: `${(postDetail?.aspect_ratio || 1) * 500}px`,
                    }}
                  >
                    <source
                      src={
                        postDetail.preview_links?.original ??
                        postDetail.preview_links?.md
                      }
                    />
                  </video>
                ) : (
                  <img
                    className="rounded-md sm:w-full w-[95%] object-cover 
                    max-h-125"
                    style={{
                      aspectRatio: `${postDetail?.aspect_ratio || 1}`,
                      maxWidth: `${(postDetail?.aspect_ratio || 1) * 500}px`,
                    }}
                    src={
                      postDetail?.preview_links?.sm_watermarked ??
                      postDetail?.preview_links?.sm
                    }
                    alt={postDetail?.title}
                  />
                )}
              </div>

              <DownloadCard
                post={postDetail!}
                selected={selectedQuality}
                setSelected={(s: DownloadData | undefined) =>
                  setSelectedQuality(s!)
                }
              />
            </div>

            <h1 className="my-4 mx-3 font-semibold text-lg">
              {postDetail?.title}
            </h1>
            <div className="md:justify-between justify-center mx-3 md:flex grid grid-cols-1">
              <div className="space-y-5 flex-1">
                <div className="w-full flex gap-24 justify-start text-gray-400">
                  <div>
                    <div className="text-lg">{t("post.views")}</div>
                    <div className="text-[#000000] font-semibold">
                      {" "}
                      {postDetail?.views_count}
                    </div>
                  </div>
                  <div>
                    <div className="text-lg ">{t("post.downloads")}</div>
                    <div className="text-[#000000] font-semibold">
                      {" "}
                      {postDetail?.downloads_count}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 justify-start ">
                  {postDetail?.tags?.map((tag, index) => (
                    <a
                      key={index}
                      href={`/explore/?tags=${tag.key}`}
                      className="text-md bg-custom-light-gray py-0 px-2 rounded-md cursor-pointer"
                    >
                      {tag.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center md:m-0  mt-3">
                <ProfileCard
                  author={postDetail?.author}
                  authorUsername={postDetail?.author?.username ?? ""}
                  description={postDetail?.author?.bio ?? ""}
                  showMessageModalHandler={() => {
                    setShowMessageModal(true);
                  }}
                />
                {/*
                // TODO: DO THIS WLE 
                <div
                  className="text-center my-4 cursor-pointer"
                  onClick={() => {}}
                >
                  <FontAwesomeIcon
                    icon={faCircleExclamation}
                    className="mr-2"
                  />
                  Report this listing
                </div> */}
              </div>
            </div>
            <div className="w-full bg-white flex flex-col items-center">
              <MasonryWrapper title={t("post.related")} screenWidth="w-[95%]" />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PictureDetail;
const Spinner = () => (
  <div className="flex justify-center items-center h-[50vh]">
    <div className="flex justify-center items-center">
      <ImageIcon
        className="text-gray-900 animate-pulse size-25" // Fading animation
      />
    </div>
  </div>
);
