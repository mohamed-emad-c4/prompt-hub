"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

interface Prompt {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function AdminPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPrompts() {
            try {
                const response = await fetch("/api/prompts");

                if (!response.ok) {
                    throw new Error("Failed to fetch prompts");
                }

                const data = await response.json();
                setPrompts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching prompts:", error);
                setLoading(false);
            }
        }

        fetchPrompts();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading prompts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link href="/admin/prompts/new">
                    <Button>Create New Prompt</Button>
                </Link>
            </div>

            {prompts.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-xl font-medium text-gray-600">No prompts available yet.</h2>
                    <p className="mt-2 text-gray-500">
                        Create your first prompt to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {prompts.map((prompt) => (
                        <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{prompt.title}</CardTitle>
                                <div className="flex items-center space-x-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.isPublished
                                            ? "bg-green-100 text-green-800"
                                            : "bg-yellow-100 text-yellow-800"
                                        }`}>
                                        {prompt.isPublished ? "Published" : "Draft"}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-gray-600 mb-4">
                                    {prompt.content.substring(0, 150)}
                                    {prompt.content.length > 150 ? "..." : ""}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-500">
                                        Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link href={`/admin/prompts/${prompt.id}`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Link href={`/prompt/${prompt.id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 