'use client';

import React from "react";

interface NumberInputParameterProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
}

const NumberInputParameter: React.FC<NumberInputParameterProps> = ({
  label,
  value,
  min,
  max,
  onChange,
}) => {
  const handleDecrement = () => {
    if (min !== undefined) onChange(Math.max(value - 1, min));
    else onChange(value - 1);
  };

  const handleIncrement = () => {
    if (max !== undefined) onChange(Math.min(value + 1, max));
    else onChange(value + 1);
  };

  const isMinDisabled = min !== undefined && value <= min;
  const isMaxDisabled = max !== undefined && value >= max;

  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex items-center gap-3 bg-white/10 rounded-lg px-4 py-3 border border-white/20">
        <button
          onClick={handleDecrement}
          disabled={isMinDisabled}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            isMinDisabled
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/20 active:bg-white/30"
          }`}
          type="button"
        >
          <i className="fa-solid fa-minus text-sm" />
        </button>
        
        <div className="flex-1 text-center">
          <span className="font-bold text-lg">{value}</span>
          {(min !== undefined || max !== undefined) && (
            <div className="text-xs text-white/60 mt-1">
              {min !== undefined && max !== undefined
                ? `${min} - ${max}`
                : min !== undefined
                ? `Min: ${min}`
                : `Max: ${max}`}
            </div>
          )}
        </div>
        
        <button
          onClick={handleIncrement}
          disabled={isMaxDisabled}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            isMaxDisabled
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-white/20 active:bg-white/30"
          }`}
          type="button"
        >
          <i className="fa-solid fa-plus text-sm" />
        </button>
      </div>
    </div>
  );
};

export default NumberInputParameter;