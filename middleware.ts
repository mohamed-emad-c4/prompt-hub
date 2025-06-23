import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Configure middleware to use the experimental Edge Runtime
export const runtime = 'experimental-edge';

// This is a simple middleware for demo purposes only
// In a real application, use NextAuth.js or a similar solution
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect admin routes
    if (pathname.startsWith("/admin")) {
        // For demo purposes, we'll use a simple check
        // In a real app, this would verify a session token
        const isAuthenticated = request.cookies.has("admin_authenticated");

        if (!isAuthenticated) {
            // Redirect to a login page (which you would need to create)
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Only run middleware on admin routes
    matcher: ["/admin/:path*"],
}; 