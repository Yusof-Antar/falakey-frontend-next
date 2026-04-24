"use client";
export const dynamic = "force-dynamic";

import { useTrans } from "@/utils/translation";
const logo = "/images/falakey-logo-old.svg";
const banner = "/images/ai-banner.png";
import { useEffect, useRef, useState } from "react";
import { useFetchFilter } from "@/helper/filterHook";
import { search } from "@/lib/slices/searchSlice";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { MenuItem, Select } from "@mui/material";
import MasonryWrapper from "@/components/Masonry/MasonryWrapper";
import type { RootState } from "@/types/RootState";
import { sortingVar } from "@/utils/defaultVariables";
import SEO from "@/components/Common/SEO";
import { apiRequest } from "@/utils/apiRequest";
import { AIConfig } from "@/models/Ai";
import NumberInputParameter from "@/components/Ai/NumberInputParameter";
import SelectParameter from "@/components/Ai/SelectParameter";
import AIConfigDropDown from "@/components/Ai/AiConfigDropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSlidersH,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigateWithLocale } from "../helper/navigateWithLocale";

// ─── Centered Modal Component ─────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const ConfigModal = ({ isOpen, onClose, children, title }: ModalProps) => {
  useEffect(() => {
    // FIX: Added check to ensure document exists (Build Safety)
    if (typeof document !== "undefined") {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen && typeof document !== "undefined") {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      if (typeof document !== "undefined") {
        document.removeEventListener("keydown", handleKey);
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="
            pointer-events-auto
            w-full max-w-lg
            bg-white rounded-3xl shadow-2xl
            flex flex-col
            max-h-[85dvh]
            animate-modalIn
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-[#ad3c6d] to-[#8c3279] shadow-md">
                <FontAwesomeIcon
                  icon={faSlidersH}
                  className="text-white size-4"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  {title || "Settings"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Customize generation parameters
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="
                flex items-center justify-center w-9 h-9
                rounded-full bg-gray-100 text-gray-500
                hover:bg-gray-200 hover:text-gray-700
                transition-all duration-150
                flex-shrink-0
              "
              aria-label="Close"
            >
              <FontAwesomeIcon icon={faTimes} className="size-3.5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>

          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="
                w-full py-2.5 rounded-xl
                bg-gradient-to-r from-amber-500 via-[#ad3c6d] to-[#8c3279]
                text-white text-sm font-semibold
                hover:opacity-90 transition-opacity
                shadow-md
              "
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease forwards; }
        .animate-modalIn { animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
    </>
  );
};

// ─── Parameters Content ───────────────────────────────────────────────────────
interface ParamsContentProps {
  loading: boolean;
  model: AIConfig | null;
  selectedConfig: { modelId: string; providerId: string } | null;
  setSelectedConfig: (
    config: { modelId: string; providerId: string } | null,
  ) => void;
  setParametersState: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  parametersState: Record<string, any>;
  currentParams: any[];
  handleParameterChange: (key: string, value: any) => void;
  t: (key: string) => string;
}

const ParamsContent = ({
  loading,
  model,
  selectedConfig,
  setSelectedConfig,
  setParametersState,
  parametersState,
  currentParams,
  handleParameterChange,
  t,
}: ParamsContentProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin size-5 text-[#ad3c6d]"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-gray-800">
      <div>
        <AIConfigDropDown
          label={t("ai.provider")}
          config={model?.["image-generation"]}
          handleModelSelect={(m) => {
            setSelectedConfig(m);
            setParametersState({});
          }}
          selectedConfig={selectedConfig}
        />
      </div>

      {currentParams.length > 0 && (
        <>
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentParams.map((param) => {
              if (param.type === "integer") {
                return (
                  <NumberInputParameter
                    key={param.key}
                    label={param.label}
                    value={parametersState[param.key] ?? param.default}
                    min={param.config?.min}
                    max={param.config?.max}
                    onChange={(val) => handleParameterChange(param.key, val)}
                  />
                );
              }
              if (param.type === "select") {
                return (
                  <SelectParameter
                    key={param.key}
                    label={param.label}
                    value={parametersState[param.key] ?? param.default}
                    options={param.options}
                    onChange={(val) => handleParameterChange(param.key, val)}
                  />
                );
              }
              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AiGallery = () => {
  const { t } = useTrans();
  const navigate = useNavigateWithLocale();

  const texts = [
    {
      id: 1,
      title: t("ai_gallery.item_title_1"),
      text: t("ai_gallery.item_text_1"),
    },
    {
      id: 2,
      title: t("ai_gallery.item_title_2"),
      text: t("ai_gallery.item_text_2"),
    },
    {
      id: 3,
      title: t("ai_gallery.item_title_3"),
      text: t("ai_gallery.item_text_3"),
    },
  ];

  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.auth);
  const { types } = useSelector((state: RootState) => state.search);
  const previousSearch = useSelector((state: RootState) => state.search);
  const masonryRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const { data: filters } = useFetchFilter("");

  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sorting") || sortingVar,
  );
  const [searchInput, setSearchInput] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [model, setModel] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<{
    modelId: string;
    providerId: string;
  } | null>(null);
  const [parametersState, setParametersState] = useState<Record<string, any>>(
    {},
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput) {
        dispatch(search({ ...previousSearch, placeholder: searchInput }));
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch, previousSearch]);

  useEffect(() => {
    if (token) {
      let isMounted = true;
      setLoading(true);
      apiRequest({ method: "GET", url: "ai/models", withLocale: true, token })
        .then((result) => {
          if (!isMounted) return;
          if (result.data["success"]) {
            const modelData = result.data["data"];
            setModel(modelData);
            const imageGeneration = modelData["image-generation"];
            if (imageGeneration) {
              const firstProviderId = Object.keys(imageGeneration)[0];
              if (firstProviderId) {
                const firstModelId = Object.keys(
                  imageGeneration[firstProviderId],
                )[0];
                if (firstModelId)
                  setSelectedConfig({
                    providerId: firstProviderId,
                    modelId: firstModelId,
                  });
              }
            }
          }
        })
        .catch((error) => console.error("Fetch failed:", error))
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => {
        isMounted = false;
      };
    }
  }, [token]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    if (val.length >= 20) setSearchError(null);
  };

  const handleParameterChange = (key: string, value: any) =>
    setParametersState((prev) => ({ ...prev, [key]: value }));

  const validate = (): boolean => {
    if (!searchInput.trim()) {
      setSearchError(t("ai.error_empty") || "Please enter a prompt.");
      return false;
    }
    if (searchInput.trim().length < 20) {
      setSearchError(
        t("ai.error_min_length") || "Prompt must be at least 20 characters.",
      );
      return false;
    }
    setSearchError(null);
    return true;
  };

  const handleGenerateClick = () => {
    if (!validate()) return;
    const paramString = new URLSearchParams(
      Object.entries(parametersState).map(([key, value]) => [
        key,
        String(value),
      ]),
    ).toString();
    const configString = selectedConfig
      ? `&providerId=${encodeURIComponent(selectedConfig.providerId)}&modelId=${encodeURIComponent(selectedConfig.modelId)}`
      : "";
    navigate(
      `image-generator?prompt=${encodeURIComponent(searchInput)}${configString}${paramString ? `&${paramString}` : ""}`,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleGenerateClick();
  };

  const currentParams =
    selectedConfig && model
      ? (model["image-generation"]?.[selectedConfig.providerId]?.[
          selectedConfig.modelId
        ]?.parameters ?? [])
      : [];

  const hasParams = token && currentParams.length > 0;

  return (
    <>
      <SEO
        title={`${t("seo.ai_gallery_title")}`}
        description={`${t("seo.ai_gallery_description")}`}
        name="Falakey"
        type="article"
        image={banner}
      />

      <ConfigModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={t("ai.settings_title") || "Generation Settings"}
      >
        <ParamsContent
          loading={loading}
          model={model}
          selectedConfig={selectedConfig}
          setSelectedConfig={setSelectedConfig}
          setParametersState={setParametersState}
          parametersState={parametersState}
          currentParams={currentParams}
          handleParameterChange={handleParameterChange}
          t={t}
        />
      </ConfigModal>

      <div className="pt-4 sm:pt-6 flex flex-col items-center">
        <div className="w-[95%] sm:max-w-screen-size flex flex-col gap-4 sm:gap-6">
          <div className="h-fit">
            <div
              className="w-full h-[380px] sm:h-[420px] md:h-[500px] bg-[#1a1659] rounded-2xl sm:rounded-[40px] relative flex flex-col justify-center items-center bg-no-repeat bg-cover bg-bottom px-4"
              style={{ backgroundImage: `url(${banner})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1659]/80 via-transparent to-transparent rounded-2xl sm:rounded-[40px]" />
              <img
                src={logo}
                className="absolute left-4 sm:left-8 md:left-20 top-8 sm:top-12 md:top-16 w-32 sm:w-40 md:w-48 z-10"
                alt=""
              />

              <div className="relative flex flex-col items-center mt-20 sm:mt-24 md:mt-20 gap-5 sm:gap-6 w-full z-50">
                <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center px-2 font-semibold drop-shadow-lg">
                  {t("ai.title")}
                </h1>

                <div className="w-[97%] sm:w-[92%] md:w-[82%] xl:w-[58%] flex flex-col gap-1.5 z-10">
                  <div
                    className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 px-3 py-2.5 border backdrop-blur-md rounded-2xl transition-colors duration-200 ${
                      searchError
                        ? "border-red-400/70 bg-red-500/10"
                        : "border-white/40 bg-white/10"
                    }`}
                  >
                    <input
                      type="text"
                      value={searchInput}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder={t("ai.generate_placeholder")}
                      className="w-full sm:flex-1 bg-transparent pe-2 text-white placeholder-gray-300 outline-none text-sm sm:text-base py-1"
                    />
                    <div className="flex gap-2 items-center">
                      {hasParams && (
                        <button
                          type="button"
                          onClick={() => setShowModal(true)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/30 bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors whitespace-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faSlidersH}
                            className="size-3.5"
                          />
                          <span className="hidden sm:inline">
                            {t("ai.settings_title") || "Settings"}
                          </span>
                        </button>
                      )}
                      <button
                        onClick={handleGenerateClick}
                        className="flex gap-2 items-center justify-center px-5 py-2 bg-gradient-to-r rounded-xl from-amber-600 via-[#ad3c6d] to-[#8c3279] text-white text-sm font-semibold whitespace-nowrap shadow-lg hover:opacity-90 transition-opacity"
                      >
                        {t("ai.generate_button")}
                        <i className="fa-solid fa-camera-retro" />
                      </button>
                    </div>
                  </div>
                  {searchError && (
                    <div className="flex items-center gap-1.5 px-1 animate-fadeIn text-red-300 text-xs font-medium">
                      {searchError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-primary px-2 sm:px-0">
            <div className="mt-6 sm:mt-10 md:mt-14 mb-6 sm:mb-10 md:mb-14 text-center">
              <p className="text-sm sm:text-base md:text-lg text-secondary font-semibold tracking-widest uppercase mb-2">
                {t("ai_gallery.title")}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2 leading-tight">
                {t("ai_gallery.description")}
              </h1>
            </div>

            <div className="flex flex-col md:flex-row justify-around w-full gap-6 md:gap-4">
              {texts.map((item) => (
                <div
                  key={item.id}
                  className="w-full md:max-w-[350px] px-2 sm:px-0 group"
                >
                  <div className="flex gap-4 p-4 rounded-2xl border border-primary/10 hover:border-secondary/30 hover:shadow-md transition-all duration-300 bg-white hover:bg-secondary/5">
                    <div className="flex items-start pt-[3px] flex-shrink-0">
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-secondary to-[#8c3279] text-white text-sm font-bold shadow-md">
                        {item.id}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-base sm:text-lg text-primary mb-1">
                        {item.title}
                      </h5>
                      <p className="text-sm text-justify text-primary/70 leading-snug">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-white flex flex-col justify-center items-center">
            <div className="sm:max-w-screen-size w-[95%] flex flex-col sm:flex-row sm:justify-between justify-center items-center gap-4 sm:gap-0">
              <div className="text-2xl sm:text-3xl lg:text-4xl text-primary font-bold leading-tight my-6 sm:my-10">
                {t("ai.masonry_title")}
              </div>
              <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                <Select
                  value={selectedSort}
                  className="max-h-[50px] !rounded-xl w-full sm:w-auto"
                  onChange={(e) => {
                    dispatch(
                      search({ ...previousSearch, sorting: e.target.value }),
                    );
                    setSelectedSort(e.target.value);
                  }}
                >
                  {filters?.sorting.map((sort, index) => (
                    <MenuItem key={index} value={sort.key}>
                      {sort.label}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
            <div className="w-full flex justify-center" ref={masonryRef}>
              <MasonryWrapper
                title=""
                stringFiltering={`types=${types}&is_ai=1&sorting=${selectedSort}&search=${searchInput}`}
                screenWidth="w-[95%]"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AiGallery;
