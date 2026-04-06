'use client';

import useClickOutside from "@/utils/useClickOutside";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Option {
  label: string;
  value: string;
  icon?: string;
}

interface SelectParameterProps {
  label: string;
  value: string;
  options: Option[];
  onChange: (val: string) => void;
}

const SelectParameter: React.FC<SelectParameterProps> = ({
  label,
  value,
  options,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click — watches both the trigger container and the portalled dropdown
  useClickOutside(containerRef, () => setOpen(false));

  // Calculate and set dropdown position from trigger's viewport rect
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    });
  };

  useEffect(() => {
    if (open) updatePosition();
  }, [open]);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          style={dropdownStyle}
          className="bg-[#44175b] rounded-lg shadow-2xl border border-white/20 max-h-60 overflow-y-auto"
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-3 flex items-center gap-2 cursor-pointer text-white transition-colors first:rounded-t-lg last:rounded-b-lg ${
                opt.value === value
                  ? "bg-gradient-to-r from-[#f27c40] to-[#8c3177] font-semibold"
                  : "hover:bg-white/20"
              }`}
              onMouseDown={(e) => {
                // mousedown fires before outside-click blur, preventing flicker
                e.preventDefault();
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.icon && (
                <img
                  src={opt.icon}
                  alt={opt.label}
                  className="w-4 h-4 flex-shrink-0"
                />
              )}
              <span className="truncate">{opt.label}</span>
            </div>
          ))}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-semibold">{label}</label>

      <div ref={containerRef} className="relative">
        {/* Trigger */}
        <div
          ref={triggerRef}
          className="px-4 py-3 border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer flex items-center justify-between transition-colors"
          onClick={() => setOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedOption?.icon && (
              <img
                src={selectedOption.icon}
                alt={selectedOption.label}
                className="w-4 h-4 flex-shrink-0"
              />
            )}
            <span className="truncate">
              {selectedOption?.label ?? "Select an option"}
            </span>
          </div>
          <i
            className={`fa-solid fa-chevron-down transition-transform text-sm ms-2 flex-shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {dropdown}
    </div>
  );
};

export default SelectParameter;
