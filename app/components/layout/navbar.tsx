"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('admin_authenticated='));
        setIsAuthenticated(!!authCookie);

        // Add scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        // Clear the authentication cookie
        document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsAuthenticated(false);
        router.push("/");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <nav
                className={`container mx-auto px-6 py-3 flex justify-between items-center transition-all duration-300 ${scrolled
                        ? 'bg-white/70 backdrop-blur-md shadow-soft rounded-2xl mt-4'
                        : 'bg-transparent shadow-none mt-2'
                    }`}
            >
                <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-800">
                    <svg
                        className="w-8 h-8 text-primary-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                    <span className="text-xl font-bold bg-clip-text  bg-gradient-to-r from-primary-600 to-primary-800">
                        PromptHub
                    </span>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link
                        href="/"
                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                    >
                        Home
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link
                        href="/admin"
                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
                    >
                        Admin
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    {isAuthenticated ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="border-gray-200 hover:bg-gray-50 hover:text-primary-600 transition-all"
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="primary"
                                size="sm"
                                className="bg-primary-600 hover:bg-primary-700 text-black shadow-sm hover:shadow transition-all"
                            >
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
} 