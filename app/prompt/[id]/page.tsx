"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { PromptWithDetails } from '@/app/lib/types';
import Link from 'next/link';

export default function PromptPage() {
    const params = useParams();
    const id = params.id as string;

    const [prompt, setPrompt] = useState<PromptWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchPrompt = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/prompts/${id}`);
                if (!response.ok) throw new Error('Prompt not found');
                const fetchedPrompt: PromptWithDetails = await response.json();

                if (fetchedPrompt && !Array.isArray(fetchedPrompt.variables)) {
                    fetchedPrompt.variables = [];
                }
                setPrompt(fetchedPrompt);
            } catch (error) {
                console.error("Failed to fetch prompt", error);
                setPrompt(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, [id]);

    const handleCopy = () => {
        if (!prompt) return;
        navigator.clipboard.writeText(prompt.content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

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

    if (!prompt) {
        return <div className="flex justify-center items-center h-screen">Prompt not found.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <Link href="/prompts" className="text-primary-600 hover:underline flex items-center">
                    &larr; Back to Prompts
                </Link>
            </div>

            <div className="lg:col-span-3">
                <Card className="card-glass">
                    <CardHeader>
                        <CardTitle className="text-2xl">{prompt.title}</CardTitle>
                        <CardDescription className="pt-2">{prompt.description || 'No description available.'}</CardDescription>
                        <div className="pt-4 flex flex-wrap gap-2">
                            <span className="text-sm font-medium bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                                {prompt.category?.name || 'Uncategorized'}
                            </span>
                            {prompt.tags.map(promptTag => (
                                <span key={promptTag.tag.id} className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-full">
                                    {promptTag.tag.name}
                                </span>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2 text-lg">Prompt Template</h3>
                                <pre className="min-h-[300px] bg-white/50 font-mono text-sm border-gray-300 p-4 rounded-md whitespace-pre-wrap">
                                    {prompt.content}
                                </pre>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button onClick={handleCopy} className="w-full" variant="outline">
                                    {isCopied ? 'Copied!' : 'Copy Template'}
                                </Button>
                                <Button asChild className="w-full" variant="primary">
                                    <Link href={`/customize/${prompt.id}`}>Use Prompt</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 