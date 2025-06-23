import { notFound } from "next/navigation";
import PromptForm from "../form";
import { db } from "@/app/lib/db";
import { Category, Tag } from "@/app/lib/types";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

// Define the params type for Next.js 15+
interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Define the prompt type with all required properties
interface PromptWithRelations {
    id: number;
    title: string;
    content: string;
    description?: string | null;
    isPublished: boolean;
    categoryId?: number | null;
    createdAt: Date;
    updatedAt: Date;
    category?: Category | null;
    tags: Array<{
        tag: Tag;
    }>;
}

async function getPrompt(promptId: number): Promise<PromptWithRelations | null> {
    try {
        // Use a simpler approach with a type assertion at the end
        const prompt = await db.prompt.findUnique({
            where: {
                id: promptId,
            },
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true,
                    }
                }
            }
        }) as PromptWithRelations | null;

        return prompt;
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return null;
    }
}

export default async function EditPromptPage({ params }: PageProps) {
    // Await the params object to get the id
    const { id } = await params;
    const promptId = parseInt(id);

    if (isNaN(promptId)) {
        return notFound();
    }

    const prompt = await getPrompt(promptId);

    if (!prompt) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Edit Prompt</h1>
                <p className="text-gray-600 mt-2">
                    Edit your prompt template with dynamic variables using the {'{{'} variable {'}}'} syntax.
                </p>
            </div>

            <PromptForm
                mode="edit"
                prompt={{
                    id: prompt.id,
                    title: prompt.title,
                    content: prompt.content,
                    isPublished: prompt.isPublished,
                    description: prompt.description,
                    categoryId: prompt.categoryId || undefined,
                    tags: prompt.tags.map(p => p.tag),
                }}
            />
        </div>
    );
} 