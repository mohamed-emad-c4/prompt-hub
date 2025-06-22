import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const isPublished = searchParams.get("isPublished");

        const where = isPublished === "true" ? { isPublished: true } : {};

        const prompts = await db.prompt.findMany({
            where,
            orderBy: {
                updatedAt: "desc",
            },
        });

        return NextResponse.json(prompts);
    } catch (error) {
        console.error("Error fetching prompts:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompts" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content, isPublished, categoryId, tags } = body;

        // Validate required fields
        if (!title || !content || !categoryId) {
            return NextResponse.json(
                { error: "Title, content, and category are required" },
                { status: 400 }
            );
        }

        // Handle tags: find existing or create new ones
        const tagOperations = tags.map((tagName: string) => {
            return {
                where: { name: tagName },
                create: { name: tagName },
            };
        });

        const prompt = await db.prompt.create({
            data: {
                title,
                content,
                isPublished: isPublished || false,
                categoryId,
                tags: {
                    connectOrCreate: tagOperations,
                },
            },
        });

        return NextResponse.json(prompt, { status: 201 });
    } catch (error) {
        console.error("Error creating prompt:", error);
        return NextResponse.json(
            { error: "Failed to create prompt" },
            { status: 500 }
        );
    }
} 