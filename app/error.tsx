"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                We apologize for the inconvenience. An error has occurred.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={reset} variant="primary">
                    Try Again
                </Button>
                <Link href="/">
                    <Button variant="outline">Go Back Home</Button>
                </Link>
            </div>
        </div>
    );
} 