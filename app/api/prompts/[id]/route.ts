import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(request: Request, { params }: RouteParams) {
    try {
        // Ensure params is properly awaited
        const { id } = params;
        const promptId = parseInt(id);

        if (isNaN(promptId)) {
            return NextResponse.json(
                { error: "Invalid prompt ID" },
                { status: 400 }
            );
        }

        const prompt = await db.prompt.findUnique({
            where: {
                id: promptId,
            },
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true
                    }
                }
            }
        });

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(prompt);
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return NextResponse.json(
            { error: "Failed to fetch prompt" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, { params }: RouteParams) {
    try {
        // Ensure params is properly awaited
        const { id } = params;
        const promptId = parseInt(id);

        if (isNaN(promptId)) {
            return NextResponse.json(
                { error: "Invalid prompt ID" },
                { status: 400 }
            );
        }

        // Check if prompt exists
        const existingPrompt = await db.prompt.findUnique({
            where: {
                id: promptId,
            },
        });

        if (!existingPrompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            );
        }

        const body = await request.json();
        const { title, content, isPublished, categoryId, tags } = body;

        // Validate required fields
        if (!title || !content || !categoryId) {
            return NextResponse.json(
                { error: "Title, content and category are required" },
                { status: 400 }
            );
        }

        const tagOperations = tags.map((tagName: string) => {
            return {
                where: { name: tagName },
                create: { name: tagName },
            };
        });

        const updatedPrompt = await db.prompt.update({
            where: {
                id: promptId,
            },
            data: {
                title,
                content,
                isPublished: isPublished || false,
                categoryId,
                tags: {
                    set: [], // Disconnect all existing tags first
                    connectOrCreate: tagOperations,
                },
            },
        });

        return NextResponse.json(updatedPrompt);
    } catch (error) {
        console.error("Error updating prompt:", error);
        return NextResponse.json(
            { error: "Failed to update prompt" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, { params }: RouteParams) {
    try {
        const { id } = params;
        const promptId = parseInt(id);

        if (isNaN(promptId)) {
            return NextResponse.json({ error: "Invalid prompt ID" }, { status: 400 });
        }

        const body = await request.json();
        const { isPublished } = body;

        if (typeof isPublished !== 'boolean') {
            return NextResponse.json({ error: "isPublished must be a boolean" }, { status: 400 });
        }

        const updatedPrompt = await db.prompt.update({
            where: { id: promptId },
            data: { isPublished },
        });

        return NextResponse.json(updatedPrompt);
    } catch (error) {
        console.error("Error updating prompt status:", error);
        return NextResponse.json(
            { error: "Failed to update prompt status" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        // Ensure params is properly awaited
        const { id } = params;
        const promptId = parseInt(id);

        if (isNaN(promptId)) {
            return NextResponse.json(
                { error: "Invalid prompt ID" },
                { status: 400 }
            );
        }

        // Check if prompt exists
        const existingPrompt = await db.prompt.findUnique({
            where: {
                id: promptId,
            },
        });

        if (!existingPrompt) {
            return NextResponse.json(
                { error: "Prompt not found" },
                { status: 404 }
            );
        }

        await db.prompt.delete({
            where: {
                id: promptId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting prompt:", error);
        return NextResponse.json(
            { error: "Failed to delete prompt" },
            { status: 500 }
        );
    }
} 