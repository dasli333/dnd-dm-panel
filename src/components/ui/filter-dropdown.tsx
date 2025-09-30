"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterDropdownProps {
  label: string;
  icon?: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  className?: string;
}

export function FilterDropdown({
  label,
  icon,
  options,
  selectedValues,
  onSelectionChange,
  className,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = (option: string, checked: boolean) => {
    const newValues = checked ? [...selectedValues, option] : selectedValues.filter((v) => v !== option);
    onSelectionChange(newValues);
  };

  const hasSelection = selectedValues.length > 0;

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2",
          hasSelection
            ? "bg-red-900/30 text-red-300 border border-red-700/50"
            : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
        )}
      >
        {icon && <span className="text-xs">{icon}</span>}
        <span>{hasSelection ? `${label} (${selectedValues.length})` : label}</span>
        <ChevronDown className={cn("size-3 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute top-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 backdrop-blur-none min-w-48 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm text-gray-300"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={(e) => handleToggle(option, e.target.checked)}
                className="mr-2 rounded text-cyan-400 focus:ring-cyan-500 bg-gray-700 border-gray-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
