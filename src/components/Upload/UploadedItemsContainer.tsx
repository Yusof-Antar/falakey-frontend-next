'use client';
import { LegacyRef, useEffect, useRef, useState } from "react";
import UploadedItemPreview from "./UploadedItemPreview";
import { useUploadHook } from "@/helper/uploadHook";
import { UploadParam } from "@/models/uploadParam";
import UploadItemMobilePreview from "./UploadItemMobilePreview";
import { Tag } from "@/models/tag";
import { useTrans } from "@/utils/translation";

const UploadedItemsContainer = ({
  uploads,
  handleRemove,
  handleUpdateUpload,
  handleBrowseClick,
  handleFileInputChange,
  fileInputRef,
  acceptUpload,
  handleSetTags,
  handleTagToAllUploads,
}: {
  uploads: UploadParam[];
  handleRemove: (id: number) => void;
  handleUpdateUpload: (id: number) => void;
  handleBrowseClick: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: LegacyRef<HTMLInputElement>;
  acceptUpload: string;

  handleSetTags: (id: number, tags: Tag[]) => void;
  handleTagToAllUploads: (tags: Tag[]) => void;
}) => {
  const { t } = useTrans();
  const { data, getTags } = useUploadHook();

  useEffect(() => {
    getTags();
  }, []);

  const [selectedUpload, setSelectedUpload] = useState<UploadParam>(uploads[0]);

  useEffect(() => {
    setSelectedUpload(uploads[0]);
  }, [uploads]);

  const previewRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleSelectSquare = (upload: UploadParam) => {
    setSelectedUpload(upload);
    // Smooth scroll to the selected preview
    // setTimeout(() => {
    //   previewRefs.current[upload.id]?.scrollIntoView({
    //     behavior: "smooth",
    //     block: "center",
    //     inline: "center",
    //   });
    // }, 0);
  };

  return (
    <div className="relative w-full  lg:grid grid-cols-[100px_1fr] flex flex-col gap-3 max-w-screen-size">
      <div className="">
        <div className="lg:flex hidden flex-col overflow-y-auto items-start gap-3 p-1 max-h-[calc(100vh-250px)] fixed">
          <div
            onClick={handleBrowseClick}
            className="size-[80px] p-1 aspect-square rounded-xl overflow-clip bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-circle-plus text-gray-400" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept={acceptUpload}
            />
          </div>
          {uploads.map((upload) => (
            <div
              key={upload.id}
              onClick={() => handleSelectSquare(upload)}
              className={`relative size-[80px] p-0.5 aspect-square rounded-xl overflow-clip cursor-pointer transition-all ${
                selectedUpload.id === upload.id
                  ? `ring-4 ${
                      upload.error ? "ring-error" : "ring-secondary"
                    } shadow-lg`
                  : ""
              } `}
            >
              {upload.error && (
                <>
                  <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                  <div className=" absolute top-[50%] left-[50%] transform -translate-y-[50%] -translate-x-[50%] size-7 rounded-full aspect-square bg-error flex items-center justify-center">
                    <i className="fa-solid fa-exclamation text-white text-lg" />
                  </div>
                </>
              )}
              <img
                src={
                  upload.img?.previewUrl ??
                  (upload.img?.file ? URL.createObjectURL(upload.img.file) : "")
                }
                className="size-full object-cover rounded-xl "
                alt=""
              />
            </div>
          ))}
        </div>
      </div>

      <section className="w-full flex flex-col flex-1 justify-center lg:justify-start gap-4  text-center overflow-y-scroll ">
        <div className="w-full flex flex-col gap-1 items-center">
          <h1 className="text-3xl font-semibold text-gray-800 ">
            {t("upload.secondary_title")}
          </h1>
          <p className="text-md max-w-2xl mb-3">
            {t("upload.secondary_description")}
          </p>
        </div>
        <div className="lg:hidden flex flex-row items-center  gap-2 overflow-x-auto w-full p-1">
          <div
            onClick={handleBrowseClick}
            className="size-[66px] p-1 aspect-square rounded-xl overflow-clip bg-gray-100 flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-circle-plus text-gray-400" />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
              accept={acceptUpload}
            />
          </div>
          {uploads.map((upload) => (
            <div
              key={upload.id}
              onClick={() => handleSelectSquare(upload)}
              className={`relative size-[70px] p-0.5 aspect-square rounded-xl overflow-clip cursor-pointer transition-all ${
                selectedUpload.id === upload.id
                  ? "ring-2 ring-secondary shadow-lg"
                  : ""
              }`}
            >
              {upload.error && (
                <>
                  <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                  <div className=" absolute top-[50%] left-[50%] transform -translate-y-[50%] -translate-x-[50%] size-7 rounded-full aspect-square bg-error flex items-center justify-center">
                    <i className="fa-solid fa-exclamation text-white text-lg" />
                  </div>
                </>
              )}
              <img
                src={
                  upload.img?.previewUrl ??
                  (upload.img?.file ? URL.createObjectURL(upload.img.file) : "")
                }
                className="size-full object-cover rounded-xl"
                alt=""
              />
            </div>
          ))}
        </div>

        {uploads.map((upload) => (
          <div
            className="lg:block hidden"
            key={upload.id}
            ref={(el) => {
              if (el) previewRefs.current[upload.id] = el;
            }}
          >
            <UploadedItemPreview
              uploads={uploads}
              upload={upload}
              tags={data.tags ?? []}
              handleRemove={handleRemove}
              handleUpdateUpload={handleUpdateUpload}
              handleSetTags={handleSetTags}
              handleTagToAllUploads={handleTagToAllUploads}
            />
          </div>
        ))}
        <div className="lg:hidden block">
          <UploadItemMobilePreview
            uploads={uploads}
            upload={selectedUpload}
            tags={data.tags ?? []}
            handleRemove={handleRemove}
            handleUpdateUpload={handleUpdateUpload}
            handleSetTags={handleSetTags}
            handleTagToAllUploads={handleTagToAllUploads}
          />
        </div>
      </section>
    </div>
  );
};

export default UploadedItemsContainer;
