'use client';
import { useState } from "react";
import ContentTypeRadio from "../UploadedModal/ContentTypeRadio";
import UploadAutoComplete from "./UploadAutoComplete";
import { useTrans } from "@/utils/translation";
import { UploadParam } from "@/models/uploadParam";
import { Tag } from "@/models/tag";
import { Button } from "../ui/button";

const UploadedItemPreview = ({
  uploads,
  upload,
  tags,
  handleRemove,
  handleUpdateUpload,
  handleSetTags,
  handleTagToAllUploads,
}: {
  uploads: UploadParam[];
  upload: UploadParam;
  tags: Tag[];
  handleRemove: (id: number) => void;
  handleUpdateUpload: (id: number) => void;
  handleSetTags: (id: number, tags: Tag[]) => void;
  handleTagToAllUploads: (tags: Tag[]) => void;
}) => {
  const { t } = useTrans();
  // const [locationSearch, setLocationSearch] = useState(false);
  // const [suggestedSearches, setSuggestedSearches] = useState([]);
  // const [locationLoading, setLocationLoading] = useState(false);
  // const [locationSelected, setLocationSelected] = useState(true);
  // const [locationSelectedName, setLocationSelectedName] = useState("");

  // const searchBoxCore = useSearchBoxCore({
  //   accessToken:
  //     process.env.NEXT_PUBLIC_MAPBOX,
  // });

  const [contentType, setContentType] = useState<"free" | "premium" | "locked">(
    "free"
  );
  return (
    <div className="flex gap-2 items-center">
      <div
        className={`w-full p-8 ${
          upload.error ? "bg-error/20" : "bg-gray-100"
        } rounded-3xl shadow-md overflow-hidden flex`}
      >
        <div className="relative max-h-[600px] min-h-[200px] w-full max-w-[400px] rounded-3xl overflow-clip ">
          <div className="relative h-full w-full flex items-center justify-center">
            {upload.img?.loading && (
              <div className="h-full w-full z-20 flex items-center justify-center absolute bg-white/30"></div>
            )}

            {upload.img?.file?.type.startsWith("video") ? (
              <video className="w-full h-full object-cover">
                <source
                  src={URL.createObjectURL(upload.img.file)}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={
                  upload.img?.previewUrl ??
                  (upload.img?.file ? URL.createObjectURL(upload.img.file) : "")
                }
                className="flex object-contain w-full rounded-3xl overflow-clip"
                alt="Uploaded preview"
              />
            )}
          </div>
        </div>
        {upload.error ? (
          <div className="flex flex-col justify-center gap-3 text-start text-error p-6">
            <h2 className="text-4xl">{t("common.error")}</h2>
            <div className="text-2xl">{upload.error}</div>
            <Button
              onClick={() => handleUpdateUpload(upload.id)}
              className="bg-error text-lg text-white w-fit"
            >
              {t("upload.browse_new")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 w-full p-2">
            <input
              type="text"
              className="h-[40px] pe-2 ps-3 bg-transparent border-2 border-gray-200 rounded-lg focus-visible:outline-secondary"
              placeholder={t("uploaded_data.title_placeholder")}
              onChange={(e) => {
                upload.title = e.target.value;
              }}
            />
            <textarea
              className="h-[80px] p-2 ps-3 bg-transparent border-2 border-gray-200 rounded-lg focus-visible:outline-secondary"
              placeholder={t("uploaded_data.description_placeholder")}
            />
            <div className="grid grid-cols-3 gap-2">
              <ContentTypeRadio
                title={t("upload_modal.free")}
                description={t("upload_modal.free_text")}
                icon=""
                selectedType={contentType}
                type="free"
                selectedColor="primary"
                handleContentTypeChange={(s: "free" | "premium" | "locked") => {
                  upload.isPremium = false;
                  upload.isLocked = false;
                  setContentType(s);
                }}
              />
              <ContentTypeRadio
                title={t("upload_modal.premium")}
                disabled
                description={t("upload_modal.premium_text")}
                icon="fa-solid fa-crown"
                selectedType={contentType}
                type="premium"
                selectedColor="yellow-500"
                handleContentTypeChange={(s: "free" | "premium" | "locked") => {
                  upload.isPremium = true;
                  upload.isLocked = false;
                  setContentType(s);
                }}
              />
              <ContentTypeRadio
                title={t("upload_modal.locked")}
                description={t("upload_modal.locked_text")}
                icon="fa-solid fa-lock"
                selectedType={contentType}
                type="locked"
                selectedColor="error"
                handleContentTypeChange={(s: "free" | "premium" | "locked") => {
                  upload.isPremium = false;
                  upload.isLocked = true;
                  setContentType(s);
                }}
              />
            </div>
            {/* <div className="border-gray-200 border-2 rounded-lg h-[50px] flex items-center px-3 bg-transparent z-20">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-500 mr-2"
              />
              <input
                type="text"
                className="h-full w-full bg-transparent px-2 focus-visible:outline-none text-gray-700"
                value={locationSelectedName}
                onChange={(event) => {
                  setLocationSelected(false);
                  setLocationLoading(true);
                  setLocationSelectedName(event.target.value);
                  // handleLocationChange(uploadedData.id, {
                  //   name: event.target.value,
                  // });
                  searchBoxCore
                    .suggest(event.target.value, {
                      sessionToken: "test-123",
                    })
                    .then((result) => {
                      // setSuggestedSearches(result["suggestions"] as []);
                      // setLocationLoading(false);
                    });
                }}
                placeholder="Search for a location..."
              />
              {locationLoading ? (
                <CircularProgress className="!text-primary !w-[25px] !h-[25px] mx-1" />
              ) : (
                <button
                  onClick={() => {
                    // setLocationSelected(true);
                    // setLocationSearch(false);
                    // setLocationSelectedName("");
                    // handleLocationChange(uploadedData.id, {});
                  }}
                  className="text-gray-500 hover:text-gray-700 ml-2"
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              )}
              {!locationLoading &&
                suggestedSearches.length > 0 &&
                !locationSelected && (
                  <div className="absolute bottom-16 left-3 right-3 z-50 max-h-[200px] overflow-y-auto bg-white shadow-lg rounded-md border border-gray-200">
                    {suggestedSearches.map((suggested, index) => (
                      <div
                        key={index}
                        className="w-full p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={async () => {
                          await searchBoxCore
                            .retrieve(suggested, {
                              sessionToken: "test-123",
                            })
                            .then((result) => {
                              setLocationSelectedName(
                                result["features"][0]["properties"]["name"]
                              );
                              setLocationSelected(true);
                              // handleLocationChange(uploadedData.id, {
                              //   name: result["features"][0]["properties"][
                              //     "name"
                              //   ],
                              //   long: result["features"][0]["geometry"][
                              //     "coordinates"
                              //   ][0].toString(),
                              //   lat: result["features"][0]["geometry"][
                              //     "coordinates"
                              //   ][1].toString(),
                              // });
                            });
                        }}
                      >
                        <div className="font-bold text-sm text-gray-800">
                          {suggested["name"]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {suggested["place_formatted"]}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div> */}
            <UploadAutoComplete
              label={t("uploaded_data.tags_placeholder")}
              values={tags ?? []}
              selectedValues={upload.tags ?? []}
              setSelectedValues={(values: Tag[]) =>
                handleSetTags(upload.id, values)
              }
            />
            {uploads.length > 1 && (
              <div
                className="text-start text-gray-600 border-b border-gray-600 border-dashed w-fit cursor-pointer"
                onClick={() => {
                  handleTagToAllUploads(upload.tags!);
                }}
              >
                <i className="fa-solid fa-check-double me-1" />
                {t("upload.add_tags")}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        onClick={() => (upload.img?.loading ? null : handleRemove(upload.id))}
        className={`${
          upload.error ? "bg-error text-white" : "bg-gray-100"
        } size-[70px] aspect-square rounded-full flex items-center justify-center ${
          upload.img?.loading ? "cursor-default opacity-30" : "cursor-pointer "
        }`}
      >
        <i className="fa-regular fa-trash-can" />
      </div>
    </div>
  );
};

export default UploadedItemPreview;
