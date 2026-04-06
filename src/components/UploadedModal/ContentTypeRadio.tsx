'use client';
const ContentTypeRadio = ({
  title,
  disabled = false,
  description,
  selectedType,
  icon,
  type,
  selectedColor,
  handleContentTypeChange,
}: {
  title: string;
  disabled?: boolean;
  description: string;
  icon: string;
  selectedType: string;
  type: string;
  selectedColor: string;

  handleContentTypeChange: (s: "free" | "premium" | "locked") => void;
}) => {
  return (
    <div
      className={`p-3 rounded-md border  transition-colors ${
        selectedType === type
          ? `border-${selectedColor} bg-${selectedColor}/10`
          : `border-gray-300 ${disabled ? "" : "hover:bg-gray-100"} `
      }
      
      ${disabled ? "opacity-70 bg-gray-200 cursor-default" : "cursor-pointer"}`}
      onClick={() =>
        disabled
          ? null
          : handleContentTypeChange(type as "free" | "premium" | "locked")
      }
    >
      <div className="flex items-center">
        <div
          className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center ${
            selectedType === type
              ? `border-${selectedColor} bg-${selectedColor}`
              : "border-gray-400"
          }`}
        >
          {selectedType === type && (
            <div className="w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
        <div className="flex gap-1 items-center">
          <i className={`${icon} text-${selectedColor} mr-1`} />
          <span className="text-sm">{title}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default ContentTypeRadio;
