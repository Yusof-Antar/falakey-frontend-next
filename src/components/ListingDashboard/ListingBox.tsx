'use client';
import { Post } from "@/models/post";
import { useTrans } from "@/utils/translation";
import ImageIcon from "@mui/icons-material/Image";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { useState } from "react";
import { Challenge } from "@/models/challenge";
import { getDaysLeftString } from "@/utils/getDaysLeftString";

const ListingBox = ({
  data,
  challenges,
  challengeLoading,
}: {
  data: Post;
  challenges: Challenge[];
  challengeLoading: boolean;
}) => {
  const { t } = useTrans();
  const [showActions, setShowActions] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Check if post is approved
  const isApproved = data?.status?.key?.toLowerCase() === "published";

  const handleAddToChallenge = () => {
    setShowActions(false);
    setShowChallengeModal(true);
  };

  const handleDeleteClick = () => {
    setShowActions(false);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    console.log("Deleting post:", data.id);
    setShowDeleteModal(false);
  };

  const handleSelectChallenge = (challenge: Challenge) => {
    // Add your logic here to add post to challenge
    console.log("Adding post to challenge:", {
      postId: data.id,
      challengeId: challenge.id,
    });
    setShowChallengeModal(false);
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Header with Image and Title */}
        <div className="relative">
          <div className="p-4 pb-3">
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                {data?.type === "video" ? (
                  <video
                    className="w-full h-full object-cover"
                    src={data?.preview_links?.original}
                  />
                ) : data?.preview_links?.thumb ? (
                  <img
                    className="w-full h-full object-cover"
                    src={data?.preview_links.thumb}
                    alt={data?.title}
                  />
                ) : (
                  <ImageIcon className="text-gray-400" fontSize="large" />
                )}
              </div>

              {/* Title and Actions */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold font-lexend text-gray-900 line-clamp-2 mb-2">
                  {data?.title}
                </h2>

                {/* Status Badge */}
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ backgroundColor: data?.status?.color }}
                >
                  {data?.status?.key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertIcon className="text-gray-600" fontSize="small" />
                </button>

                {/* Dropdown Menu */}
                {showActions && (
                  <>
                    <div
                      className="fixed  inset-0 z-10"
                      onClick={() => setShowActions(false)}
                    />
                    <div className="absolute end-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      {isApproved && (
                        <button
                          onClick={handleAddToChallenge}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <EmojiEventsIcon
                            fontSize="small"
                            className="text-gray-500"
                          />
                          {t("listing.add_to_challenge")}
                        </button>
                      )}
                      <button
                        onClick={handleDeleteClick}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      >
                        <DeleteIcon fontSize="small" className="text-red-500" />
                        {t("listing.delete")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 pb-4">
          <div className="grid grid-cols-3 gap-3 mb-3">
            {/* Favorites */}
            <div className="flex flex-col items-center p-2 bg-red-50 rounded-lg">
              <FavoriteIcon className="text-red-500 mb-1" fontSize="small" />
              <span className="text-xs text-gray-600 mb-0.5">
                {t("listing.favorites")}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {data?.favorites_count || 0}
              </span>
            </div>

            {/* Downloads */}
            <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg">
              <DownloadIcon className="text-blue-500 mb-1" fontSize="small" />
              <span className="text-xs text-gray-600 mb-0.5">
                {t("listing.downloads")}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {data?.downloads_count || 0}
              </span>
            </div>

            {/* Views */}
            <div className="flex flex-col items-center p-2 bg-purple-50 rounded-lg">
              <VisibilityIcon
                className="text-purple-500 mb-1"
                fontSize="small"
              />
              <span className="text-xs text-gray-600 mb-0.5">
                {t("listing.views")}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {data?.views_count || 0}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <span className="capitalize">
              {t("listing.type")}:{" "}
              <span className="font-medium text-gray-700">{data?.type}</span>
            </span>
            <span>
              {t("listing.created")}:{" "}
              <span className="font-medium text-gray-700">
                {data?.created_at}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Challenge Selection Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {t("listing.add_to_challenge")}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {t("listing.select_challenge_to")} "{data?.title}"
                </p>
              </div>
              <button
                onClick={() => setShowChallengeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CloseIcon className="text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {challengeLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : challenges && challenges.length > 0 ? (
                <div className="space-y-3">
                  {challenges.map((challenge) => (
                    <button
                      key={challenge.id}
                      onClick={() => handleSelectChallenge(challenge)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Challenge Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
                          {challenge.media && challenge.media.length > 0 ? (
                            <img
                              src={
                                challenge.media[0].sm ||
                                challenge.media[0].thumb
                              }
                              alt={challenge.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <EmojiEventsIcon
                                className="text-blue-500"
                                fontSize="large"
                              />
                            </div>
                          )}
                        </div>

                        {/* Challenge Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-start text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {challenge.title}
                          </h4>
                          <p className="text-sm text-start text-gray-600 line-clamp-2 mb-2">
                            {challenge.short_description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="font-medium text-orange-600">
                                {getDaysLeftString(
                                  t,
                                  challenge?.days_left ?? 0,
                                )}
                              </span>
                            </span>
                            {challenge.participants && (
                              <span>{challenge.participants.description}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <EmojiEventsIcon
                    className="text-gray-300 mx-auto mb-3"
                    fontSize="large"
                  />
                  <p className="text-gray-500">
                    {t("listing.no_active_challenge")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <WarningIcon className="text-red-600" fontSize="medium" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t("listing.delete_post")}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("listing.action_cannot_be_undone")}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 " dir="rtl">
                {t("listing.are_you_sure")}{" "}
                <span className="font-semibold">"{data?.title}"</span>{" "}
                {t("listing.delete_confirmation")}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t("listing.cancel")}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t("listing.delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListingBox;
