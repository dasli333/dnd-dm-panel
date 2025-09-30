"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export type Language = "en" | "pl";

export interface LanguageSwitchProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

export function LanguageSwitch({ language, onLanguageChange, className }: LanguageSwitchProps) {
  return (
    <div className={cn("flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-1 border border-gray-600", className)}>
      <Languages className="size-4 text-gray-400" />
      <span className="text-sm text-gray-400">Names:</span>
      <button
        type="button"
        onClick={() => onLanguageChange("en")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded transition-colors",
          language === "en" ? "text-purple-500" : "text-gray-300 hover:text-white"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange("pl")}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded transition-colors",
          language === "pl" ? "text-purple-500" : "text-gray-300 hover:text-white"
        )}
      >
        PL
      </button>
    </div>
  );
}
