'use client';
import { RootState } from "@/lib/store";
import { apiRequest } from "@/utils/apiRequest";
import { useState } from "react";
import { useSelector } from "react-redux";

const ImageGrid = ({ images }: { images: string[] }) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const { token } = useSelector((state: RootState) => state.auth);

  const isBase64Image = (str: string) => {
    return /^data:image\/[a-zA-Z]+;base64,/.test(str);
  };

  const handleDownload = async (url: string, index: number) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    if ("showSaveFilePicker" in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `image-${index}.jpg`,
        types: [
          {
            description: "Images",
            accept: { "image/*": [".png", ".jpg", ".jpeg"] },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const link = new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        const tempLink = document.createElement("a");
        tempLink.href = reader.result as string;
        tempLink.download = `image-${index}.jpg`;
        tempLink.dispatchEvent(link);
      };
      reader.readAsDataURL(blob);
    }

    URL.revokeObjectURL(objectUrl);
  };

  const handleUpload = async (url: string, index: number) => {
    try {
      setUploadingIndex(index);
      await apiRequest({
        method: "POST",
        url: "ai/posts/publish",
        data: { url },
        token: token!,
        showSuccess: true,
        showError: true,
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <>
      {/* 🖼️ Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((i, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden group bg-[#f4eff5]/10"
          >
            <img
              src={i}
              alt={`image-${index}`}
              className="size-full bg-white/30 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
            />

            {/* 🔍 Zoom Button */}
            <CustomImageButton
              title="Zoom"
              icon="fa-solid fa-magnifying-glass-plus"
              position="top-3 right-3"
              handle={() => setZoomedImage(i)}
            />

            {/* ⬇️ Download Button */}
            {isBase64Image(i) ? (
              <CustomImageButton
                title="Download"
                icon="fa-solid fa-download"
                position="top-3 left-3"
                handle={() => handleDownload(i, index)}
              />
            ) : (
              <a
                href={`https://admin.falakey.com/files/download?url=${encodeURIComponent(
                  i
                )}`}
                className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-[30%] aspect-square size-8 shadow-md transition flex items-center justify-center"
                title="Download"
              >
                <i className="fa-solid fa-download text-sm" />
              </a>
            )}

            {/* ⬆️ Upload Button or Loading Icon */}
            {uploadingIndex === index ? (
              <button
                disabled
                className="absolute bottom-3 right-3 bg-white/80 text-gray-800 p-2 rounded-[30%] aspect-square size-8 shadow-md flex items-center justify-center"
                title="Uploading..."
              >
                <i className="fa-solid fa-spinner animate-spin text-sm" />
              </button>
            ) : (
              <CustomImageButton
                title="Upload to your account"
                icon="fa-solid fa-upload"
                position="bottom-3 right-3"
                handle={() => handleUpload(i, index)}
              />
            )}
          </div>
        ))}
      </div>

      {/* 🔎 Zoom Modal */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-300">
          <div className="relative w-fit mx-4 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="w-full max-h-[85vh] object-cover rounded-2xl scale-100 animate-zoomIn"
            />

            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* ❌ Close */}
            <CustomImageButton
              title="Close"
              icon="fa-solid fa-xmark"
              position="top-4 right-4"
              handle={() => setZoomedImage(null)}
            />

            {/* ⬇️ Download (Zoomed) */}
            {isBase64Image(zoomedImage) ? (
              <CustomImageButton
                title="Download"
                icon="fa-solid fa-download"
                position="top-3 left-3"
                handle={() => handleDownload(zoomedImage, 0)}
              />
            ) : (
              <a
                href={`https://admin.falakey.com/files/download?url=${encodeURIComponent(
                  zoomedImage
                )}`}
                className="absolute top-3 left-3 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-[30%] aspect-square size-8 shadow-md transition flex items-center justify-center"
                title="Download"
              >
                <i className="fa-solid fa-download text-sm" />
              </a>
            )}

            {/* ⬆️ Upload (Zoomed) */}
            <CustomImageButton
              title="Upload to your account"
              icon="fa-solid fa-upload"
              position="bottom-5 right-5"
              handle={() => handleUpload(zoomedImage, -1)}
            />
          </div>
        </div>
      )}
    </>
  );
};

const CustomImageButton = ({
  title,
  icon,
  position,
  handle,
}: {
  title: string;
  icon: string;
  position: string;
  handle: () => void;
}) => {
  return (
    <button
      onClick={handle}
      className={`absolute ${position} bg-white/80 hover:bg-white text-gray-800 p-2 rounded-[30%] aspect-square size-8 shadow-md transition flex items-center justify-center`}
      title={title}
    >
      <i className={`${icon} text-sm`} />
    </button>
  );
};

export default ImageGrid;
