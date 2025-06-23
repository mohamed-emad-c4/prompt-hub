import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// Configure this route to use the Edge Runtime
export const runtime = 'edge';

export async function GET() {
    try {
        const tags = await db.tag.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json(
            { error: "Failed to fetch tags" },
            { status: 500 }
        );
    }
} 