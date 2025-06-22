"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function Navbar() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if admin is authenticated
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('admin_authenticated='));
        setIsAuthenticated(!!authCookie);
    }, []);

    const handleLogout = () => {
        // Clear the authentication cookie
        document.cookie = "admin_authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setIsAuthenticated(false);
        router.push("/");
    };

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-primary-600">
                                PromptHub
                            </span>
                        </Link>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <Link href="/" className="text-gray-700 hover:text-primary-600">
                            Home
                        </Link>
                        <Link href="/admin" className="text-gray-700 hover:text-primary-600">
                            Admin
                        </Link>
                        {isAuthenticated ? (
                            <Button variant="outline" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <Link href="/login">
                                <Button variant="primary" size="sm">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
} 