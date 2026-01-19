import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ChipSelectorProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelect?: number;
  error?: string;
  helperText?: string;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  label,
  options,
  selected = [],
  onChange,
  maxSelect,
  error,
  helperText
}) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      if (maxSelect && selected.length >= maxSelect) {
        // Optional: Shake animation or toast warning?
        return;
      }
      onChange([...selected, option]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {maxSelect && (
          <span className={cn("text-xs", selected.length >= maxSelect ? "text-pink-400" : "text-gray-500")}>
            {selected.length}/{maxSelect}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleOption(option)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                isSelected 
                  ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_10px_rgba(236,72,153,0.2)]" 
                  : "bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-gray-200 hover:border-gray-600"
              )}
            >
              <div className="flex items-center gap-1.5">
                {isSelected && <Check size={14} className="animate-in zoom-in duration-200" />}
                {option}
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
};
