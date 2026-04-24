"use client";
export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UploadParam } from "@/models/uploadParam";
import { getFileTemp } from "@/helper/postHook";
import { useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import UploadDefaultContainer from "@/components/Upload/UploadDefaultContainer";
import UploadedItemsContainer from "@/components/Upload/UploadedItemsContainer";
import { ProgressCircle } from "@/components/ui/ProgressCircle";
import { useUploadHook } from "@/helper/uploadHook";
import confetti from "canvas-confetti";
import Swal from "sweetalert2";
import { useTrans } from "@/utils/translation";
import { Tag } from "@/models/tag";
import { usePathname, useSearchParams } from "next/navigation";
import AuthenticationModal from "@/components/Authentication/AuthenticationModal";
import { useNavigateWithLocale } from "@/helper/navigateWithLocale";

const Upload: React.FC = () => {
  const navigate = useNavigateWithLocale();
  const searchParams = useSearchParams();
  const challenge = searchParams.get("challenge");

  const challengeSlug = searchParams.get("challengeSlug");

  const [uploads, setUploads] = useState<UploadParam[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxUploads = challenge ? 1 : 50;
  const acceptUpload = "image/*,video/*,application/postscript";

  const isAnyImageLoading = uploads.some((data) => data.img?.loading === true);

  // Count files that have successfully uploaded (finished loading AND no error)
  const uploadsSuccessCount = uploads.filter(
    (data) => data.img?.loading === false && data.error === undefined,
  ).length;

  // Count files that have failed (finished loading AND have an error)
  const uploadsErrorCount = uploads.filter(
    (data) => data.img?.loading === false && data.error !== undefined,
  ).length;

  // Total number of files
  const totalUploads = uploads.length;

  const { token } = useSelector((state: RootState) => state.auth);

  const { t } = useTrans();

  const [openAuthModal, setOpenAuthModal] = useState(false);

  useEffect(() => {
    if (!token) {
      setOpenAuthModal(true);
    }
  }, [token, openAuthModal]);

  const uploadGuidelines = [
    { text: t("upload.text1") },
    { text: t("upload.text2") },
    { text: t("upload.text3") },
    { text: t("upload.text4") },
    { text: t("upload.text5") },
    { text: t("upload.text6") },
  ];

  const { uploadPosts, successUpload } = useUploadHook();
  const fireConfetti = (particleRatio: number, options = {}) => {
    const particleCount = 200;

    confetti({
      ...options,
      particleCount: Math.floor(particleCount * particleRatio),
      zIndex: 99999,
    });
  };

  const fireConfettiRealistic = (options = {}) => {
    fireConfetti(0.25, {
      ...options,
      spread: 26,
      startVelocity: 55,
    });
    fireConfetti(0.2, {
      ...options,
      spread: 60,
    });
    fireConfetti(0.35, {
      ...options,
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fireConfetti(0.1, {
      ...options,
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fireConfetti(0.1, {
      ...options,
      spread: 120,
      startVelocity: 45,
    });
  };
  const confettiHandler = () => {
    // Bottom-left confetti
    fireConfettiRealistic({
      origin: { y: 1, x: 0 }, // Bottom-left corner
      angle: 45, // Diagonal launch direction
    });

    // Bottom-right confetti
    fireConfettiRealistic({
      origin: { y: 1, x: 1 }, // Bottom-right corner
      angle: 135, // Diagonal launch direction
    });
  };

  useEffect(() => {
    if (successUpload.success) {
      confettiHandler();
      Swal.fire({
        text: successUpload.message ?? "",
        icon: "success",
        confirmButtonText: t("google.ok"),
      }).then(() => {
        setUploads([]);
        if (challenge) {
          navigate(`/challenge/${challengeSlug}`); // adjust path to match your routing
        }
      });
    } else {
      if (successUpload.message)
        Swal.fire({
          title: t("common.error"),
          text: successUpload.message ?? "",
          icon: "error",
          confirmButtonText: t("google.ok"),
        });
    }
  }, [successUpload]);

  // Handle file selection (from drag-drop or browse)
  const handleImageToUploadData = (files: File[]) => {
    if (files.length > 0) {
      const remainingSlots = maxUploads - uploads.length;

      if (remainingSlots <= 0 || files.length > remainingSlots) {
        Swal.fire({
          title: t("common.error"),
          text: t("upload.max_upload_error"),
          icon: "warning",
          confirmButtonText: t("google.ok"),
        });
        if (remainingSlots <= 0) return; // No slots left at all, stop here
      }

      const filesToProcess = files.slice(0, maxUploads - uploads.length);

      filesToProcess.forEach((file) => {
        let height = 0;
        let width = 0;

        const updateUploadData = (
          file: File,
          width: number,
          height: number,
          thumbnail?: File,
        ) => {
          setUploads((prevFiles: UploadParam[]) => [
            ...prevFiles,
            {
              id: prevFiles.length,
              img: {
                file: file,
                loading: true,
                width: width,
                height: height,
                thumbnail: thumbnail,
                tempPath: undefined,
                previewUrl: undefined,
              },
            },
          ]);
        };

        if (file.type.startsWith("video")) {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(file);
          video.crossOrigin = "anonymous";
          video.muted = true;
          video.currentTime = 1;

          video.addEventListener("loadedmetadata", () => {
            width = video.videoWidth;
            height = video.videoHeight;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            video.play();

            video.addEventListener("seeked", () => {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              canvas.toBlob((thumbnailBlob) => {
                if (thumbnailBlob) {
                  const thumbnailFile = new File(
                    [thumbnailBlob],
                    `thumbnail-${file.name}.jpg`,
                    { type: "image/jpeg" },
                  );

                  updateUploadData(file, width, height, thumbnailFile);
                }
              }, "image/jpeg");
            });
          });
        } else {
          updateUploadData(file, width, height);
        }

        // API call to get temp path and preview URL
        getFileTemp(file, token!)
          .then((result) => {
            if (result["success"]) {
              setUploads((prevFiles: UploadParam[]) =>
                prevFiles.map((uploadFile) =>
                  uploadFile.img!.file === file
                    ? {
                        ...uploadFile,
                        img: {
                          ...uploadFile.img,
                          tempPath: result["temp_path"],
                          previewUrl: result["preview_url"],
                          loading: false,
                        },
                      }
                    : uploadFile,
                ),
              );
            } else {
              setUploads((prevFiles: UploadParam[]) =>
                prevFiles.map((uploadFile) =>
                  uploadFile.img!.file === file
                    ? {
                        ...uploadFile,
                        img: {
                          ...uploadFile.img,
                          tempPath: undefined,
                          previewUrl: undefined,
                          loading: false,
                        },
                        error: result.message,
                      }
                    : uploadFile,
                ),
              );
            }
          })
          .catch(() => {
            setUploads((prevFiles: UploadParam[]) =>
              prevFiles.filter((uploadFile) => uploadFile.img!.file !== file),
            );
          });
        // .finally(() => {});
      });
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleImageToUploadData(droppedFiles);
  };

  // Handle browse button click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleImageToUploadData(selectedFiles);
  };

  const handleRemove = (id: number, callback?: () => void) => {
    setUploads((prevData) => prevData.filter((data) => data.id !== id));
    callback?.();
  };

  const handleUpdateUpload = (id: number) => {
    // Create a temporary file input for this specific upload
    const tempInput = document.createElement("input");
    tempInput.type = "file";
    tempInput.accept = acceptUpload;
    tempInput.style.display = "none";

    tempInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const selectedFile = target.files?.[0];

      if (selectedFile) {
        let height = 0;
        let width = 0;

        const replaceUploadData = (
          file: File,
          width: number,
          height: number,
          thumbnail?: File,
        ) => {
          setUploads((prevFiles: UploadParam[]) =>
            prevFiles.map((uploadFile) =>
              uploadFile.id === id
                ? {
                    ...uploadFile,
                    img: {
                      file: file,
                      loading: true,
                      width: width,
                      height: height,
                      thumbnail: thumbnail,
                      tempPath: undefined,
                      previewUrl: undefined,
                    },
                    error: undefined, // Clear any previous error
                  }
                : uploadFile,
            ),
          );
        };

        if (selectedFile.type.startsWith("video")) {
          const video = document.createElement("video");
          video.src = URL.createObjectURL(selectedFile);
          video.crossOrigin = "anonymous";
          video.muted = true;
          video.currentTime = 1;

          video.addEventListener("loadedmetadata", () => {
            width = video.videoWidth;
            height = video.videoHeight;

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) return;

            video.play();

            video.addEventListener("seeked", () => {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

              canvas.toBlob((thumbnailBlob) => {
                if (thumbnailBlob) {
                  const thumbnailFile = new File(
                    [thumbnailBlob],
                    `thumbnail-${selectedFile.name}.jpg`,
                    { type: "image/jpeg" },
                  );

                  replaceUploadData(selectedFile, width, height, thumbnailFile);
                }
              }, "image/jpeg");
            });
          });
        } else {
          replaceUploadData(selectedFile, width, height);
        }

        // API call to get temp path and preview URL
        getFileTemp(selectedFile, token!)
          .then((result) => {
            if (result["success"]) {
              setUploads((prevFiles: UploadParam[]) =>
                prevFiles.map((uploadFile) =>
                  uploadFile.id === id
                    ? {
                        ...uploadFile,
                        img: {
                          ...uploadFile.img,
                          tempPath: result["temp_path"],
                          previewUrl: result["preview_url"],
                          loading: false,
                        },
                      }
                    : uploadFile,
                ),
              );
            } else {
              setUploads((prevFiles: UploadParam[]) =>
                prevFiles.map((uploadFile) =>
                  uploadFile.id === id
                    ? {
                        ...uploadFile,
                        img: {
                          ...uploadFile.img,
                          tempPath: undefined,
                          previewUrl: undefined,
                          loading: false,
                        },
                        error: result.message,
                      }
                    : uploadFile,
                ),
              );
            }
          })
          .catch(() => {
            // On error, you could either keep the old file or remove it
            // Here we'll keep the entry but mark it with an error
            setUploads((prevFiles: UploadParam[]) =>
              prevFiles.map((uploadFile) =>
                uploadFile.id === id
                  ? {
                      ...uploadFile,
                      img: {
                        ...uploadFile.img,
                        loading: false,
                      },
                      error: t("upload.error_uploading"),
                    }
                  : uploadFile,
              ),
            );
          });
      }

      // Clean up the temporary input
      document.body.removeChild(tempInput);
    };

    // Add to DOM and trigger click
    document.body.appendChild(tempInput);
    tempInput.click();
  };

  const handleTagToAllUploads = (tags: Tag[]) => {
    setUploads((prevUpload: UploadParam[]) =>
      prevUpload.map((u: UploadParam) => ({
        ...u,
        tags: tags,
      })),
    );
  };
  const handleSetTags = (id: number, tags: Tag[]) => {
    setUploads((prevUpload: UploadParam[]) =>
      prevUpload.map((u: UploadParam) =>
        u.id === id ? { ...u, tags: tags } : u,
      ),
    );
  };

  // const handleLocationToAllUploads = (location: string) => {
  //   setUploads((prevUpload: UploadParam[]) =>
  //     prevUpload.map((u: UploadParam) => ({
  //       ...u,
  //       location: location,
  //     }))
  //   );
  // };

  return (
    <>
      {openAuthModal && <AuthenticationModal modalHandler={setOpenAuthModal} />}
      <div className="flex flex-col items-center py-12 mx-4">
        {/* Title Section */}

        {uploads.length == 0 && (
          <UploadDefaultContainer
            uploads={uploads}
            acceptUpload={acceptUpload}
            fileInputRef={fileInputRef}
            handleBrowseClick={handleBrowseClick}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleFileInputChange={handleFileInputChange}
            isDragging={isDragging}
            maxUploads={maxUploads}
            uploadGuidelines={uploadGuidelines}
          />
        )}
        {uploads.length > 0 && (
          <UploadedItemsContainer
            handleRemove={handleRemove}
            acceptUpload={acceptUpload}
            fileInputRef={fileInputRef}
            handleBrowseClick={handleBrowseClick}
            handleFileInputChange={handleFileInputChange}
            uploads={uploads}
            handleUpdateUpload={handleUpdateUpload}
            handleSetTags={handleSetTags}
            handleTagToAllUploads={handleTagToAllUploads}
          />
        )}

        {/* Submit Section */}
        {uploads.length > 0 && (
          <footer className="fixed px-6 flex items-center lg:justify-evenly justify-between w-full h-[100px] bottom-0 bg-[#fdf9f6] shadow-lg text-secondary">
            <div className="text-secondary text-sm flex items-center gap-2">
              <ProgressCircle
                color="#f27c40"
                size={34}
                progress={(uploadsSuccessCount / totalUploads) * 100}
                loading={isAnyImageLoading}
              />
              <div className="lg:block hidden ms-2">
                <p>
                  {isAnyImageLoading
                    ? t("upload.uploading")
                    : t("upload.uploaded")}
                </p>
                <p>
                  {uploadsSuccessCount} / {totalUploads}{" "}
                  {t("upload.uploaded_text")}
                </p>
              </div>
              <p className="lg:hidden block">
                {uploadsSuccessCount} / {totalUploads}
              </p>
            </div>
            {uploadsErrorCount > 0 && (
              <div className="text-error text-sm flex items-center gap-2">
                <div className="size-9 rounded-full aspect-square bg-error flex items-center justify-center">
                  <i className="fa-solid fa-exclamation text-white text-lg" />
                </div>
                <div className="lg:block hidden ms-2">
                  <p>
                    {isAnyImageLoading
                      ? t("upload.uploading")
                      : t("upload.failed")}
                  </p>
                  <p>
                    {uploadsErrorCount} / {totalUploads}{" "}
                    {t("upload.failed_text")}
                  </p>
                </div>
                <p className="lg:hidden block">
                  {uploadsErrorCount} / {totalUploads}
                </p>
              </div>
            )}
            <Button
              disabled={isAnyImageLoading || successUpload.loading}
              className="text-white bg-secondary"
              onClick={() => {
                if (!isAnyImageLoading && uploadsErrorCount <= 0) {
                  uploadPosts(
                    uploads,
                    challenge
                      ? [{ key: "challenge_id", value: challenge }]
                      : undefined,
                  );
                }
              }}
            >
              {successUpload.loading
                ? t("upload.uploading")
                : t("upload.submit")}
            </Button>
          </footer>
        )}
      </div>
    </>
  );
};

export default Upload;
