"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { MenuIcon } from "../icons/menu-icon";
import { cn } from "@/app/lib/utils";

export function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    const navLinks = (
        <>
            <Link
                href="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
            >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
                href="/prompts"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
            >
                Prompts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
                href="/docs"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group"
            >
                Docs
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
        </>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            <nav
                className={cn(`container mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300`, {
                    'bg-white/70 backdrop-blur-md shadow-soft rounded-2xl mt-4': scrolled || isMobileMenuOpen,
                    'bg-transparent shadow-none mt-2': !scrolled && !isMobileMenuOpen,
                })}
            >
                <div className="flex justify-between items-center py-3">
                    <Logo />
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 hover:text-primary-600">
                            <MenuIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200/50">
                        <div className="flex flex-col space-y-4">
                            {navLinks}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
} 