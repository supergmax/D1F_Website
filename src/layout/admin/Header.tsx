"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import UserDropdown from "@/components/header/UserDropdown";
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
        Administration Panel
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggleButton />
        <UserDropdown />
      </div>
    </header>
  );
}
