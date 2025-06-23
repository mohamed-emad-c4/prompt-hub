import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

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
                },
                variables: true,
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
        const { title, content, description, isPublished, categoryId, tags, variables } = body;

        // Validate required fields
        if (!title || !content || !categoryId) {
            return NextResponse.json(
                { error: "Title, content and category are required" },
                { status: 400 }
            );
        }

        // We're going to do a transaction to handle the tags and variables properly
        const tagConnectOrCreate = (tags || []).map((tagName: string) => {
            return {
                where: { promptId_tagId: { promptId, tagId: 0 } }, // This is a placeholder, will be tricky
                create: { tag: { connectOrCreate: { where: { name: tagName }, create: { name: tagName } } } }
            };
        });

        const variableOperations = (variables || []).map((variable: any) => ({
            name: variable.name,
            type: variable.type,
            defaultValue: variable.defaultValue,
            options: variable.options, // Prisma handles JSON serialization
        }));

        const updatedPrompt = await db.$transaction(async (tx) => {
            // 1. Update the prompt's scalar fields
            const prompt = await tx.prompt.update({
                where: { id: promptId },
                data: {
                    title,
                    content,
                    description,
                    isPublished,
                    categoryId,
                },
            });

            // 2. Clear existing tags and connect the new ones
            await tx.promptTag.deleteMany({ where: { promptId } });
            if (tags && tags.length > 0) {
                const tagIds = await Promise.all(
                    tags.map(async (name: string) => {
                        const tag = await tx.tag.upsert({
                            where: { name },
                            update: {},
                            create: { name },
                        });
                        return tag.id;
                    })
                );

                await tx.promptTag.createMany({
                    data: tagIds.map((tagId: number) => ({
                        promptId,
                        tagId,
                    })),
                });
            }

            // 3. Clear and create variables
            await tx.promptVariable.deleteMany({ where: { promptId } });
            if (variables && variables.length > 0) {
                await tx.promptVariable.createMany({
                    data: variables.map((v: any) => ({
                        promptId,
                        name: v.name,
                        type: v.type,
                        defaultValue: v.defaultValue,
                        options: v.options,
                    })),
                });
            }

            return prompt;
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