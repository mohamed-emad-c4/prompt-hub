import { notFound } from "next/navigation";
import PromptForm from "../form";
import { db } from "@/app/lib/db";

interface EditPromptPageProps {
    params: {
        id: string;
    };
}

async function getPrompt(promptId: number) {
    try {
        const prompt = await db.prompt.findUnique({
            where: {
                id: promptId,
            },
        });

        return prompt;
    } catch (error) {
        console.error("Error fetching prompt:", error);
        return null;
    }
}

export default async function EditPromptPage({ params }: EditPromptPageProps) {
    // Ensure params is properly awaited
    const { id } = params;
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
                }}
            />
        </div>
    );
} 