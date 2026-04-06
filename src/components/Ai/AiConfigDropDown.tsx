'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIModel, AIProvider } from "@/models/Ai";
import { useTrans } from "@/utils/translation";
import useClickOutside from "@/utils/useClickOutside";

interface AISettingsDropDownProps {
  label: string;
  handleModelSelect: (
    model: { modelId: string; providerId: string } | null,
  ) => void;
  config?: {
    [providerId: string]: AIProvider;
  };
  selectedConfig?: {
    modelId: string;
    providerId: string;
  } | null;
}

const AIConfigDropDown: React.FC<AISettingsDropDownProps> = ({
  // label,
  config,
  handleModelSelect,
  selectedConfig,
}) => {
  const { t } = useTrans();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [view, setView] = useState<"providers" | "models">("providers");

  const providers = config ? Object.keys(config) : [];
  const currentProvider =
    selectedProvider && config ? config[selectedProvider] : null;

  useClickOutside(dropdownRef, () => {
    setOpen(false);
    // Reset view to providers when closing dropdown via click outside
    if (view !== "providers") {
      setView("providers");
    }
  });

  // ✅ Initialize from selectedConfig prop if available, otherwise select first provider/model
  useEffect(() => {
    if (!config) return;

    // If we have a selectedConfig prop, use it to set the initial state
    if (selectedConfig) {
      const { providerId, modelId } = selectedConfig;

      // Verify the provider exists
      if (config[providerId]) {
        const providerModels = config[providerId];
        const model = providerModels[modelId];

        if (model) {
          setSelectedProvider(providerId);
          setSelectedModel(model.name);
          return; // Exit early since we've set from selectedConfig
        }
      }
    }

    // Fallback: Select first provider/model by default
    const firstProviderKey = Object.keys(config)[0];
    if (!firstProviderKey) return; // Guard for empty config

    const providerModels = config[firstProviderKey];
    const firstModelKey = Object.keys(providerModels)[0];
    if (!firstModelKey) return; // Guard for provider with no models

    const firstModel = providerModels[firstModelKey];

    setSelectedProvider(firstProviderKey);
    setSelectedModel(firstModel.name);
    handleModelSelect({ modelId: firstModel.id, providerId: firstProviderKey });
  }, [config, selectedConfig]); // Dependency on config and selectedConfig

  const handleSelectProvider = (provider: string) => {
    setSelectedProvider(provider);
    setView("models");
  };

  const handleSelectModel = (model: AIModel) => {
    setSelectedModel(model.name);
    handleModelSelect({
      modelId: model.id,
      providerId: selectedProvider!,
    });
    setOpen(false);
    setView("providers"); // Reset view after model selection and close
  };


  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* <label className="block mb-2 text-md font-semibold">
        {t("ai.provider")}
      </label>

      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-3 py-2 bg-white/10 rounded-md border border-white/20 cursor-pointer select-none hover:bg-white/20 transition-colors"
      >
        <span className="truncate">{getDisplayText()}</span>
        <i
          className={`fa-solid fa-chevron-down transition-transform text-sm ms-2 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div> */}

      {/* 🔽 Mobile & Tablet - Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOpen(false);
                setView("providers");
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#44175b] rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto p-5 text-white"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                {view === "models" ? (
                  <button
                    className="flex items-center gap-2 text-white/70 font-medium hover:text-white transition-colors"
                    onClick={() => setView("providers")}
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                    {t("ai.back")}
                  </button>
                ) : (
                  <div />
                )}
                <button
                  className="text-white/60 text-xl hover:text-white transition-colors"
                  onClick={() => {
                    setOpen(false);
                    setView("providers");
                  }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              {/* Providers View */}
              {view === "providers" && (
                <motion.div
                  key="providers"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-lg mb-3">
                    {t("ai.select_provider")}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {providers.map((provider) => (
                      <div
                        key={provider}
                        onClick={() => handleSelectProvider(provider)}
                        className={`p-4 rounded-lg text-center cursor-pointer transition border
                        ${
                          provider === selectedProvider
                            ? "bg-gradient-to-r from-[#f27c40] to-[#8c3177] text-white border-transparent"
                            : "bg-white/10 hover:bg-white/20 border-white/20"
                        }`}
                      >
                        <div className="font-semibold">{provider}</div>
                        <div className="text-xs text-white/60 mt-1">
                          {Object.keys(config![provider]).length} models
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Models View */}
              {view === "models" && currentProvider && (
                <motion.div
                  key="models"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-semibold text-lg mb-3">
                    {selectedProvider}
                  </h3>
                  <div className="space-y-2">
                    {Object.values(currentProvider).map((model) => (
                      <div
                        key={model.id}
                        onClick={() => handleSelectModel(model)}
                        className={`p-4 rounded-lg cursor-pointer border transition
                        ${
                          model.name === selectedModel
                            ? "bg-gradient-to-r from-[#f27c40] to-[#8c3177] text-white border-transparent"
                            : "bg-white/10 hover:bg-white/20 border-white/20"
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-white/70 mt-1 line-clamp-2">
                          {model.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIConfigDropDown;
