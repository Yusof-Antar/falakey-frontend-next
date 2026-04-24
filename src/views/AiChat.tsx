"use client";
export const dynamic = "force-dynamic";

import Image from "next/image";

import { apiRequest } from "@/utils/apiRequest";
const star = "/star-icon.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/types/RootState";
import { AIConfig } from "@/models/Ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faBars,
  faXmark,
  faSlidersH,
} from "@fortawesome/free-solid-svg-icons";
import NumberInputParameter from "@/components/Ai/NumberInputParameter";
import SelectParameter from "@/components/Ai/SelectParameter";
import AIConfigDropDown from "@/components/Ai/AiConfigDropDown";
import AuthenticationModal from "@/components/Authentication/AuthenticationModal";
import { useTrans } from "@/utils/translation";
const aiIcon = "/icons/video ai icon.svg";
const starLogo = "/icons/star-icon.svg";
const videoGen = "/icons/video ai icon.svg";
const VoiceGen = "/icons/Voice ai icon.svg";
import { updateWallet } from "@/lib/slices/authSlice";
import ImageGrid from "@/components/Ai/ImageGrid";
import { useSearchParams } from "next/navigation";

const AiChat = () => {
  const { t } = useTrans();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();

  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState<
    { prompt: string; images: string[]; loading?: boolean }[]
  >([]);
  const [model, setModel] = useState<AIConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedConfig, setSelectedConfig] = useState<{
    modelId: string;
    providerId: string;
  } | null>(null);
  const [parametersState, setParametersState] = useState<Record<string, any>>(
    {},
  );
  const [generating, setGenerating] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const [urlParamsApplied, setUrlParamsApplied] = useState(false);

  useEffect(() => {
    if (!token && !user) {
      setOpenAuthModal(true);
    }
  }, [token, user, openAuthModal]);

  useEffect(() => {
    if (token) {
      let isMounted = true;
      setLoading(true);

      apiRequest({
        method: "GET",
        url: "ai/models",
        withLocale: true,
        token: token,
      })
        .then((result) => {
          if (!isMounted) return;

          if (result.data["success"]) {
            const modelData = result.data["data"];
            setModel(modelData);

            const urlProviderId = searchParams.get("providerId");
            const urlModelId = searchParams.get("modelId");

            const imageGeneration = modelData["image-generation"];
            if (imageGeneration) {
              if (
                urlProviderId &&
                urlModelId &&
                imageGeneration[urlProviderId]?.[urlModelId]
              ) {
                setSelectedConfig({
                  providerId: urlProviderId,
                  modelId: urlModelId,
                });
              } else {
                const firstProviderId = Object.keys(imageGeneration)[0];
                if (firstProviderId) {
                  const firstModelId = Object.keys(
                    imageGeneration[firstProviderId],
                  )[0];
                  if (firstModelId) {
                    setSelectedConfig({
                      providerId: firstProviderId,
                      modelId: firstModelId,
                    });
                  }
                }
              }
            }
          } else {
            console.error("API Error:", result.data["message"]);
          }
        })
        .catch((error) => {
          if (!isMounted) return;
          console.error("Fetch failed:", error);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [token]);

  useEffect(() => {
    if (urlParamsApplied || !selectedConfig || !model) return;

    const promptFromUrl = searchParams.get("prompt");
    if (!promptFromUrl) return;

    const imageGeneration = model["image-generation"];
    const currentModelParams =
      imageGeneration?.[selectedConfig.providerId]?.[selectedConfig.modelId]
        ?.parameters ?? [];

    const restoredParams: Record<string, any> = {};
    currentModelParams.forEach((param) => {
      const urlVal = searchParams.get(param.key);
      if (urlVal !== null) {
        restoredParams[param.key] =
          param.type === "integer" ? Number(urlVal) : urlVal;
      }
    });

    if (Object.keys(restoredParams).length > 0) {
      setParametersState(restoredParams);
    }

    setUrlParamsApplied(true);

    if (!generating && token) {
      const decodedPrompt = decodeURIComponent(promptFromUrl);
      setPrompt(decodedPrompt);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete("prompt");
      newParams.delete("providerId");
      newParams.delete("modelId");
      currentModelParams.forEach((p) => newParams.delete(p.key));
      setSearchParams(newParams);

      setTimeout(() => {
        if (decodedPrompt.length >= 20) {
          setGenerating(true);
          setResponse((prev) => [
            ...prev,
            { prompt: decodedPrompt, images: [], loading: true },
          ]);

          const mergedParams = { ...restoredParams };

          const queryParams = new URLSearchParams(
            Object.entries(mergedParams).map(([key, value]) => [
              key,
              String(value),
            ]),
          ).toString();

          const body = {
            type: "image-generation",
            provider: selectedConfig.providerId,
            model: selectedConfig.modelId,
            prompt: decodedPrompt,
            parameters: mergedParams,
          };

          apiRequest({
            method: "POST",
            url: `ai/models/generate?type=image-generation${queryParams ? `&${queryParams}` : ""}`,
            data: body,
            token: token,
            showError: true,
          })
            .then((result) => {
              if (result.data["success"]) {
                setResponse((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    prompt: decodedPrompt,
                    images: result.data["data"]["images"].map(
                      (i: any) => i.url,
                    ),
                    loading: false,
                  };
                  return updated;
                });
                dispatch(
                  updateWallet({
                    credits: -result.data["data"]["images"].length,
                  }),
                );
                setPrompt("");
                setParametersState({});
              }
            })
            .catch(() => {
              setResponse((prev) => prev.slice(0, -1));
            })
            .finally(() => {
              setGenerating(false);
            });
        } else {
          setError(t("ai.error_min_length"));
        }
      }, 500);
    }
  }, [
    selectedConfig,
    model,
    urlParamsApplied,
    searchParams,
    setSearchParams,
    generating,
    token,
    dispatch,
    t,
  ]);

  const handleSubmitPrompt = () => {
    if (!selectedConfig || !prompt || !token) return;

    if (prompt.length < 20) {
      setError(t("ai.error_min_length"));
      return;
    } else {
      setError("");
    }

    setGenerating(true);
    setResponse((prev) => [...prev, { prompt, images: [], loading: true }]);

    const queryParams = new URLSearchParams(
      Object.entries(parametersState).map(([key, value]) => [
        key,
        String(value),
      ]),
    ).toString();

    const body = {
      type: "image-generation",
      provider: selectedConfig.providerId,
      model: selectedConfig.modelId,
      prompt,
      parameters: parametersState,
    };

    apiRequest({
      method: "POST",
      url: `ai/models/generate?type=image-generation${queryParams ? `&${queryParams}` : ""}`,
      data: body,
      token: token,
      showError: true,
    })
      .then((result) => {
        if (result.data["success"]) {
          setResponse((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              prompt,
              images: result.data["data"]["images"].map((i: any) => i.url),
              loading: false,
            };
            return updated;
          });
          dispatch(
            updateWallet({ credits: -result.data["data"]["images"].length }),
          );
          setPrompt("");
          setParametersState({});
        }
      })
      .catch(() => {
        setResponse((prev) => prev.slice(0, -1));
      })
      .finally(() => {
        setGenerating(false);
      });
  };

  const handleParameterChange = (key: string, value: any) => {
    setParametersState((prev) => ({ ...prev, [key]: value }));
  };

  // Shared parameters list renderer
  const renderParams = () =>
    selectedConfig && model
      ? model["image-generation"][selectedConfig.providerId][
          selectedConfig.modelId
        ].parameters.map((param) => {
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
        })
      : null;

  if (loading) {
    return (
      <>
        {openAuthModal && (
          <AuthenticationModal modalHandler={setOpenAuthModal} />
        )}
        <div className="h-[84vh] flex items-center justify-center bg-gradient-to-b from-primary to-[#7a3470]">
          <FontAwesomeIcon
            icon={faSpinner}
            className="size-[40px] animate-spin text-white"
            style={{ animationDuration: "2000ms" }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {openAuthModal && <AuthenticationModal modalHandler={setOpenAuthModal} />}

      {/* ─── Settings Modal (mobile) ──────────────────────────────────────────── */}
      {openSettings && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpenSettings(false)}
          />

          {/* Modal */}
          <div className="lg:hidden fixed inset-0 z-[9999] flex items-center justify-center p-5 pointer-events-none">
            <div
              className="pointer-events-auto w-full max-w-sm bg-[#44175b] rounded-3xl shadow-2xl flex flex-col max-h-[85dvh]"
              style={{
                animation:
                  "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-[#f27c40] to-[#8c3177] shadow-md">
                    <FontAwesomeIcon
                      icon={faSlidersH}
                      className="text-white size-4"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white leading-tight">
                      {t("ai.settings_title")}
                    </h2>
                    <p className="text-xs text-white/40 mt-0.5">
                      Customize generation parameters
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpenSettings(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all flex-shrink-0"
                  aria-label="Close"
                >
                  <FontAwesomeIcon icon={faXmark} className="size-4" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4 text-white">
                <AIConfigDropDown
                  label={t("ai.provider")}
                  config={model?.["image-generation"]}
                  handleModelSelect={(m) => {
                    setSelectedConfig(m);
                    setParametersState({});
                  }}
                  selectedConfig={selectedConfig}
                />
                {renderParams()}
              </div>

              {/* Footer — credits + apply */}
              <div className="flex-shrink-0 px-6 py-4 border-t border-white/10 flex flex-col gap-3">
                <div className="bg-gradient-to-r from-secondary to-[#8c3177] text-white rounded-xl p-3 shadow-md flex items-center justify-between">
                  <p className="text-sm font-bold">
                    {t("ai.available_credits")} {user?.wallet?.credits ?? 0}
                  </p>
                </div>
                <p className="text-xs text-white/50 text-center">
                  {t("ai.credits_renew")}
                </p>
                <button
                  onClick={() => setOpenSettings(false)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#f27c40] to-[#8c3177] text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95) translateY(12px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);    }
            }
          `}</style>
        </>
      )}

      {/* ─── Desktop View ─── */}
      <div className="lg:flex hidden h-full bg-gradient-to-b from-primary to-[#7a3470]">
        <div className="bg-white/10 flex flex-col gap-10 px-7 py-6">
          <Image
            src={starLogo}
            className="size-8"
            alt=""
            width={100}
            height={100}
          />
          <Image
            src={videoGen}
            className="size-8"
            alt=""
            width={100}
            height={100}
          />
          <Image
            src={VoiceGen}
            className="size-8"
            alt=""
            width={100}
            height={100}
          />
        </div>
        <div className="lg:h-full w-full flex lg:flex-row flex-col gap-6">
          {/* Sidebar */}
          <div className="relative text-white lg:max-w-[300px] w-full h-full flex flex-col gap-4 text-start border-e-2 border-white/20 px-5 py-7">
            <div className="text-xl">{t("ai.settings_title")}</div>
            <AIConfigDropDown
              label={t("ai.provider")}
              config={model?.["image-generation"]}
              handleModelSelect={(m) => {
                setSelectedConfig(m);
                setParametersState({});
              }}
              selectedConfig={selectedConfig}
            />
            <div className="flex-1 overflow-y-auto flex flex-col gap-4">
              {renderParams()}
            </div>
            {/* Credits */}
            <div className="w-full px-5">
              <div className="bg-gradient-to-r from-secondary to-[#8c3177] text-white rounded-md p-4 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">
                    {t("ai.available_credits")} {user?.wallet?.credits ?? 0}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-200 text-center mt-1">
                {t("ai.credits_renew")}
              </div>
            </div>
          </div>

          {/* Main Panel */}
          <div className="w-full bg-white/10 rounded-xl border-white/20 border m-7 p-7 flex flex-col justify-between overflow-y-scroll text-white">
            <div>
              {response.length > 0 ? (
                response.map((r, i) => (
                  <div
                    key={i}
                    className="bg-white/10 p-6 rounded-xl border border-white/20 flex flex-col gap-5 mb-2"
                  >
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div className="text-lg font-semibold flex items-center gap-2">
                        <Image
                          src={star}
                          className="size-[26px]"
                          alt="star"
                          width={100}
                          height={100}
                        />
                        <span>{r.prompt}</span>
                      </div>
                    </div>
                    {r.loading ? (
                      <div className="flex flex-col items-center justify-center py-10 gap-3 h-[300px]">
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className="animate-spin size-8"
                        />
                        <span>{t("ai.loading_image")}</span>
                      </div>
                    ) : (
                      <ImageGrid images={r.images} />
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-center">
                  <p>{t("ai.no_results")}</p>
                </div>
              )}
            </div>

            {/* Prompt Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPrompt();
              }}
              className="bg-white/10 text-lg font-semibold p-4 rounded-xl border-2 border-white/20 flex flex-col gap-2"
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t("ai.prompt_placeholder")}
                className={`p-3 text-white placeholder:text-white/60 bg-transparent focus:outline-none ${
                  error ? "border-red-500" : ""
                }`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              <button
                type="submit"
                disabled={generating || !selectedConfig || !prompt || !token}
                className={`px-6 py-2 self-end w-fit rounded-xl text-white font-semibold flex items-center gap-2 ${
                  generating || !selectedConfig || !prompt || !token
                    ? "opacity-70 cursor-not-allowed bg-gray-400"
                    : "bg-secondary hover:opacity-90"
                }`}
              >
                {generating ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin size-4"
                    />
                    {t("ai.generating")}
                  </>
                ) : (
                  <>
                    {t("ai.generate")}
                    <Image
                      src={aiIcon}
                      alt=""
                      className="size-6"
                      width={100}
                      height={100}
                    />
                  </>
                )}
              </button>
              <div className="text-center text-xs text-gray-200">
                {t("ai.credit_cost")}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ─── Mobile View ─── */}
      <div className="lg:hidden flex flex-col h-full bg-gradient-to-b from-primary to-[#7a3470]">
        <div className="bg-white/10 flex gap-10 px-7 py-5 h-fit justify-evenly w-full">
          <Image
            src={starLogo}
            className="size-6"
            alt=""
            width={100}
            height={100}
          />
          <Image
            src={videoGen}
            className="size-6"
            alt=""
            width={100}
            height={100}
          />
          <Image
            src={VoiceGen}
            className="size-6"
            alt=""
            width={100}
            height={100}
          />
        </div>

        <div className="text-white m-3 flex-1 overflow-y-auto pb-32">
          {response.length > 0 ? (
            response.map((r, i) => (
              <div
                key={i}
                className="bg-white/10 p-6 rounded-xl border border-white/20 flex flex-col gap-5 mb-2"
              >
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="text-lg font-semibold flex items-center gap-2">
                    <Image
                      src={star}
                      className="size-[26px]"
                      alt="star"
                      width={100}
                      height={100}
                    />
                    <span>{r.prompt}</span>
                  </div>
                </div>
                {r.loading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3 h-[300px]">
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin size-8"
                    />
                    <span>{t("ai.loading_image")}</span>
                  </div>
                ) : (
                  <ImageGrid images={r.images} />
                )}
              </div>
            ))
          ) : (
            <div className="bg-white/10 p-6 rounded-xl border border-white/20 text-center">
              <p>{t("ai.no_results")}</p>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 w-full bg-[#44175b]/95 backdrop-blur-md p-5 rounded-t-3xl border-t border-white/20 shadow-xl text-[#f4eff5]">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setOpenSettings(true)}
              className="aspect-square size-[40px] flex items-center justify-center rounded-xl bg-gradient-to-r from-[#f27c40] to-[#8c3177] hover:opacity-90"
            >
              <FontAwesomeIcon icon={faBars} className="size-5" />
            </button>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("ai.prompt_placeholder")}
              rows={1}
              className={`p-3 w-full rounded-xl bg-[#44175b]/60 border ${
                error ? "border-red-500" : "border-[#f4eff5]/30"
              } text-[#f4eff5] placeholder:text-[#f4eff5]/70 focus:ring-2 focus:ring-[#f27c40]`}
            />
            <button
              onClick={handleSubmitPrompt}
              disabled={generating || !selectedConfig || !prompt || !token}
              className={`aspect-square size-[40px] flex items-center justify-center rounded-xl font-semibold ${
                generating || !selectedConfig || !prompt || !token
                  ? "opacity-60 cursor-not-allowed bg-gray-500"
                  : "bg-gradient-to-r from-[#f27c40] to-[#8c3177] hover:opacity-90"
              }`}
            >
              {generating ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="animate-spin size-4"
                />
              ) : (
                <Image
                  src={aiIcon}
                  alt="ai"
                  className="size-7"
                  width={100}
                  height={100}
                />
              )}
            </button>
          </div>
          {error && <p className="text-red-400 text-center text-xs">{error}</p>}
          <p className="text-xs text-center w-full opacity-80">
            {t("ai.credit_cost")}
          </p>
        </div>
      </div>
    </>
  );
};

export default AiChat;
