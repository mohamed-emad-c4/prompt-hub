"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { extractVariables, replaceVariables } from "@/app/lib/utils";

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface PromptFormProps {
    prompt?: {
        id?: number;
        title: string;
        content: string;
        description?: string | null;
        isPublished: boolean;
        categoryId?: number;
        tags?: Tag[];
    };
    mode: "create" | "edit";
}

export default function PromptForm({ prompt, mode }: PromptFormProps) {
    const router = useRouter();
    const [title, setTitle] = useState(prompt?.title || "");
    const [content, setContent] = useState(prompt?.content || "");
    const [description, setDescription] = useState(prompt?.description || "");
    const [isPublished, setIsPublished] = useState(prompt?.isPublished || false);
    const [categoryId, setCategoryId] = useState(prompt?.categoryId?.toString() || "");
    const [tags, setTags] = useState(prompt?.tags?.map(t => t.name).join(', ') || "");

    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // For preview
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [previewContent, setPreviewContent] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error("Failed to fetch categories");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
                setError("Could not load categories.");
            }
        };
        fetchCategories();
    }, []);

    // Extract variables from content and update preview
    useEffect(() => {
        const extractedVars = extractVariables(content);
        const newVariables: Record<string, string> = {};

        extractedVars.forEach(variable => {
            newVariables[variable] = variables[variable] || "sample value";
        });

        setVariables(newVariables);
        setPreviewContent(replaceVariables(content, newVariables));
    }, [content, variables]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !content.trim() || !categoryId) {
            setError("Title, content, and category are required.");
            return;
        }

        setIsSubmitting(true);

        try {
            const url = mode === "create" ? "/api/prompts" : `/api/prompts/${prompt?.id}`;
            const method = mode === "create" ? "POST" : "PUT";
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    content,
                    description,
                    isPublished,
                    categoryId: parseInt(categoryId),
                    tags: tagsArray,
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
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter a brief description of the prompt"
                            className="min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="category"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border p-2"
                                disabled={categories.length === 0}
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                Tags (comma-separated)
                            </label>
                            <Input
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. email, marketing, social"
                            />
                        </div>
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
                        <Switch
                            id="isPublished"
                            checked={isPublished}
                            onCheckedChange={setIsPublished}
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
                            {isSubmitting ? "Saving..." : mode === "create" ? "Create Prompt" : "Update Prompt"}
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