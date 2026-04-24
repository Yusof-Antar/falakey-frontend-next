"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { change } from "@/lib/slices/transSlice";
import { FaGlobe } from "react-icons/fa";
import type { RootState } from "@/types/RootState";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTrans } from "@/utils/translation";
import { X } from "lucide-react";

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.translation.local);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { t } = useTrans();

  /* ------------------ Detect mobile ------------------ */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* -------- Lock body scroll ONLY on mobile -------- */
  useEffect(() => {
    if (!isMobile) return;

    document.body.style.overflow = open ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, isMobile]);

  const handleLocaleChange = (value: string) => {
    dispatch(
      change({
        local: value,
        dir: value === "ar" ? "rtl" : "ltr",
      }),
    );
    setOpen(false);
  };

  const renderContent = () => (
    <div className="flex flex-col space-y-3 w-full">
      <Button
        variant={locale === "en" ? "default" : "outline"}
        className={`w-full ${locale === "en" ? "text-white" : ""}`}
        onClick={() => handleLocaleChange("en")}
      >
        English
      </Button>

      <Button
        variant={locale === "ar" ? "default" : "outline"}
        className={`w-full ${locale === "ar" ? "text-white" : ""}`}
        onClick={() => handleLocaleChange("ar")}
      >
        العربية
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop trigger */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Select language"
      >
        <FaGlobe className="text-xl" />
        <span className="text-sm capitalize">
          {locale === "ar" ? "العربية" : "English"}
        </span>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-3 px-5 rounded-full hover:bg-gray-100 transition"
        aria-label="Select language"
      >
        <FaGlobe className="text-[18px]" />
        <span className="text-lg text-[#767676] capitalize">
          {locale === "ar" ? "العربية" : "English"}
        </span>
      </button>

      {/* ---------------- MOBILE BOTTOM SHEET ---------------- */}
      {isMobile && open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div
            className="
              fixed bottom-0 left-0 right-0 z-[9999]
              bg-white rounded-t-2xl p-6
              animate-in slide-in-from-bottom duration-300
            "
            style={{ maxHeight: "90vh" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">
                {t("navbar.select_language")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderContent()}
          </div>
        </>
      )}

      {/* ---------------- DESKTOP DIALOG ---------------- */}
      {!isMobile && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm p-6">
            <DialogTitle className="text-lg font-bold text-center mb-4">
              {t("navbar.select_language")}
            </DialogTitle>

            <DialogDescription className="sr-only">
              Choose your preferred language
            </DialogDescription>

            {renderContent()}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default LanguageSelector;
