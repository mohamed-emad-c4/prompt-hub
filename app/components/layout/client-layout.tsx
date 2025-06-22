"use client";

import { ReactNode, useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function ClientLayout({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Only show the UI after first client-side render
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Return a placeholder with the same structure to avoid layout shift
        return (
            <>
                <header className="border-b border-gray-200 bg-white h-16" />
                <div className="flex-grow">{children}</div>
                <footer className="bg-white border-t border-gray-200 py-6" />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex-grow">{children}</div>
            <Footer />
        </>
    );
} 