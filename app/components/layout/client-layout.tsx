"use client";

import { useState, useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Only show the UI after first client-side render
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {mounted && <Navbar />}
            <main className="flex-grow">{children}</main>
            {mounted && <Footer />}
        </div>
    );
} 