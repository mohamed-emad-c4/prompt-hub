import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// Configure this route to use the Edge Runtime
export const runtime = 'edge';

export async function GET() {
    try {
        const categories = await db.category.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { name } = await request.json();
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }
        const newCategory = await db.category.create({
            data: { name },
        });
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Failed to create category" },
            { status: 500 }
        );
    }
} 