"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { PromptWithDetails } from '@/app/lib/types';
import Link from 'next/link';
import { PromptCustomizer } from '@/app/prompt/prompt-customizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

export default function CustomizePage() {
    const params = useParams();
    const id = params.id as string;

    const [prompt, setPrompt] = useState<PromptWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPrompt = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/prompts/${id}`);
                if (!response.ok) throw new Error('Prompt not found');
                const fetchedPrompt: PromptWithDetails = await response.json();

                if (fetchedPrompt && !Array.isArray(fetchedPrompt.variables)) {
                    fetchedPrompt.variables = [];
                }
                setPrompt(fetchedPrompt);
            } catch (err) {
                console.error("Failed to fetch prompt", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setPrompt(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, [id]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading Prompt...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-800">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-700">{error}</p>
                        <Link href="/prompts" className="text-primary-600 hover:underline mt-4 block">
                            &larr; Go back to Prompts
                        </Link>
                    </CardContent>
                </Card>
            );
        }

        if (!prompt) {
            return <div>Prompt not found.</div>;
        }

        return <PromptCustomizer prompt={prompt} />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Customize Prompt</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Adjust the variables to generate your desired output.
                    </p>
                </div>
                <Link href="/prompts" className="text-primary-600 hover:underline">
                    &larr; Back to All Prompts
                </Link>
            </div>
            {renderContent()}
        </div>
    );
} 