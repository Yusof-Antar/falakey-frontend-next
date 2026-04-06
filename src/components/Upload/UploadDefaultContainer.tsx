'use client';
import { CloudUpload } from "lucide-react";
import GuideLineItem from "./GuideLineItem";
import { UploadParam } from "@/models/uploadParam";
import { LegacyRef } from "react";
import { Button } from "../ui/button";
import { useTrans } from "@/utils/translation";

const UploadDefaultContainer = ({
  uploads,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleBrowseClick,
  handleFileInputChange,
  maxUploads,
  fileInputRef,
  acceptUpload,
  uploadGuidelines,
}: {
  uploads: UploadParam[];
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxUploads: number;
  fileInputRef: LegacyRef<HTMLInputElement> | undefined;
  acceptUpload: string;
  uploadGuidelines: { text: string }[];
}) => {
  const { t } = useTrans();

  return (
    <>
      <div className="flex flex-col items-center text-center mb-10 mt-5 max-w-xl">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          {t("upload.title")}
        </h1>
        {/* <p className="text-lg max-w-md">
          {t("upload.description_first")} {maxUploads}{" "}
          {t("upload.description_second")}
        </p> */}
      </div>
      <div
        className={`w-full max-w-screen-size p-6 border-b-0 border-4 border-dashed rounded-t-3xl text-center transition-colors ${
          isDragging
            ? "border-primary-500 bg-primary-50"
            : "border-gray-200 bg-white"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex justify-end text-xs text-gray-400">
          ({uploads.length}/{maxUploads})
        </div>

        {/* Icon/Image Placeholder */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-500">
            <CloudUpload className="size-24" />
          </div>
          <h2 className="text-3xl line-clamp-2 font-semibold text-gray-800 mb-2">
            {t("upload.drag_and_drop")}
          </h2>

          <Button
            className="text-white bg-secondary px-8 py-2 rounded-lg"
            onClick={handleBrowseClick}
            disabled={uploads.length >= maxUploads}
          >
            {t("upload.browse")}
          </Button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            accept={acceptUpload}
          />

          {/* Limit Text */}
          <p className="text-lg mt-6">
            ({t("upload.you_have")}{" "}
            <span className="font-semibold text-secondary">
              {maxUploads - uploads.length} {t("upload.uploads")}
            </span>{" "}
            {t("upload.left")})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {uploadGuidelines.map((item, index) => (
              <GuideLineItem key={index} text={item.text} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadDefaultContainer;
