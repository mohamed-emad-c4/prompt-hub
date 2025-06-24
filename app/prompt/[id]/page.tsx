"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { PromptWithDetails } from '@/app/lib/types';
import Link from 'next/link';
import { Section } from '@/app/components/layout/section';

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
        return (
            <Section>
                <div className="text-center">
                    <p className="text-lg text-gray-600">Prompt not found.</p>
                    <Button asChild className="mt-4">
                        <Link href="/prompts">Go Back to Prompts</Link>
                    </Button>
                </div>
            </Section>
        )
    }

    return (
        <Section className="py-12 sm:py-16">
            <div className="mb-8">
                <Button asChild variant="ghost">
                    <Link href="/prompts" className="text-primary-600 hover:underline flex items-center">
                        &larr; Back to Prompts
                    </Link>
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardHeader className="bg-gray-50/80 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <CardTitle className="text-3xl md:text-4xl font-extrabold text-gray-900">{prompt.title}</CardTitle>
                            <CardDescription className="mt-2 text-lg text-gray-600 max-w-3xl">
                                {prompt.description || 'No description available.'}
                            </CardDescription>
                        </div>
                        <div className="flex-shrink-0">
                            <span className="text-sm font-semibold bg-primary-100 text-primary-800 px-4 py-2 rounded-lg">
                                {prompt.category?.name || 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                    <div className="pt-4 flex flex-wrap gap-2">
                        {prompt.tags.map(promptTag => (
                            <span key={promptTag.tag.id} className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
                                {promptTag.tag.name}
                            </span>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3 text-xl text-gray-800">Prompt Template</h3>
                            <div className="relative group">
                                <pre className="min-h-[300px] bg-gray-50 font-mono text-gray-700 border border-gray-200 p-4 rounded-md whitespace-pre-wrap">
                                    {prompt.content}
                                </pre>
                                <Button onClick={handleCopy} size="sm" variant="outline" className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button asChild className="w-full sm:w-auto" size="lg" variant="default">
                                <Link href={`/customize/${prompt.id}`}>
                                    Use This Prompt
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Section>
    );
}