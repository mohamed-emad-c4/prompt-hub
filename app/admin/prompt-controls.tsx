"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

// Define the shape of the prompt object
interface Prompt {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface AdminPromptControlsProps {
    prompt: Prompt;
}

export function AdminPromptControls({ prompt }: AdminPromptControlsProps) {
    const router = useRouter();

    const togglePublishStatus = async () => {
        try {
            const response = await fetch(`/api/prompts/${prompt.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublished: !prompt.isPublished }),
            });

            if (!response.ok) throw new Error("Failed to update status");
            router.refresh();
        } catch (error) {
            console.error("Error updating prompt status:", error);
            // Handle error display to user here
        }
    };

    const deletePrompt = async () => {
        if (!window.confirm("Are you sure you want to delete this prompt?")) return;

        try {
            const response = await fetch(`/api/prompts/${prompt.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error("Failed to delete prompt");
            router.refresh();
        } catch (error) {
            console.error("Error deleting prompt:", error);
            // Handle error display to user here
        }
    };

    return (
        <div className="flex justify-between w-full">
            <div className="flex space-x-2">
                <Link href={`/admin/prompts/${prompt.id}`}>
                    <Button variant="outline" size="sm" className="text-primary-600 border-gray-200 hover:border-primary-200 hover:bg-primary-50">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        Edit
                    </Button>
                </Link>
                <Button variant="outline" size="sm" className="text-red-600 border-gray-200 hover:border-red-200 hover:bg-red-50" onClick={deletePrompt}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Delete
                </Button>
            </div>
            <Button
                variant={prompt.isPublished ? "subtle" : "primary"}
                size="sm"
                onClick={togglePublishStatus}
                className={prompt.isPublished ? "text-gray-700" : ""}
            >
                {prompt.isPublished ? "Unpublish" : "Publish"}
            </Button>
        </div>
    );
} 