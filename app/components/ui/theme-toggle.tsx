"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/app/components/ui/switch";

/**
 * ThemeToggle adds a small light/dark mode switch that toggles the `dark` class
 * on the <html> element and persists the preference in localStorage.
 */
export function ThemeToggle() {
    const [enabled, setEnabled] = useState(false);

    // Initialise based on saved preference or system setting
    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setEnabled(true);
            return;
        }
        if (saved === "light") {
            document.documentElement.classList.remove("dark");
            setEnabled(false);
            return;
        }
        // Default – follow system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            document.documentElement.classList.add("dark");
            setEnabled(true);
        }
    }, []);

    const toggleTheme = (checked: boolean) => {
        setEnabled(checked);
        if (checked) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="flex items-center space-x-1">
            <Switch id="theme-toggle" checked={enabled} onCheckedChange={toggleTheme} />
            <span className="text-sm hidden sm:inline text-gray-600 dark:text-gray-300">
                {enabled ? "Dark" : "Light"}
            </span>
        </div>
    );
} 