"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { extractVariables, replaceVariables } from "@/app/lib/utils";

interface PromptFormProps {
    prompt?: {
        id?: number;
        title: string;
        content: string;
        isPublished: boolean;
    };
    mode: "create" | "edit";
}

export default function PromptForm({ prompt, mode }: PromptFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(prompt?.title || "");
    const [content, setContent] = useState(prompt?.content || "");
    const [isPublished, setIsPublished] = useState(prompt?.isPublished || false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // For preview
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState("");

    // Extract variables from content and update preview
    useEffect(() => {
        const extractedVars = extractVariables(content);
        const newVariables: Record<string, string> = {};

        extractedVars.forEach(variable => {
            newVariables[variable] = variables[variable] || "sample value";
        });

        setVariables(newVariables);
        setPreviewContent(replaceVariables(content, newVariables));
    }, [content]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required");
            return;
        }

        if (!content.trim()) {
            setError("Content is required");
            return;
        }

        setIsSubmitting(true);

        try {
            const url = mode === "create"
                ? "/api/prompts"
                : `/api/prompts/${prompt?.id}`;

            const method = mode === "create" ? "POST" : "PUT";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    content,
                    isPublished,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save prompt");
            }

            router.refresh();
            router.push("/admin");

        } catch (error) {
            console.error("Error saving prompt:", error);
            setError("Failed to save prompt. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter prompt title"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content (use {'{{'} variable {'}}'} for dynamic variables)
                        </label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Enter prompt content with {'{{'} variables {'}}' }"
                            className="min-h-[200px]"
                        />
                    </div>

                    <div className="mb-6 flex items-center">
                        <input
                            type="checkbox"
                            id="isPublished"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                            Publish this prompt
                        </label>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin")}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Saving..."
                                : mode === "create"
                                    ? "Create Prompt"
                                    : "Update Prompt"}
                        </Button>
                    </div>
                </form>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap mb-6">
                            {previewContent}
                        </div>

                        {Object.keys(variables).length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Variables Detected:
                                </h3>
                                <ul className="list-disc pl-5 text-sm text-gray-600">
                                    {Object.keys(variables).map((variable) => (
                                        <li key={variable}>{variable}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}