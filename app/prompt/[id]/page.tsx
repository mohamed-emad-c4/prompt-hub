"use client";

import { useEffect, useState, useRef } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { extractVariables, replaceVariables } from "@/app/lib/utils";

interface PromptDetailPageProps {
    params: {
        id: string;
    };
}

interface Prompt {
    id: number;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function PromptDetailPage({ params }: PromptDetailPageProps) {
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [finalPrompt, setFinalPrompt] = useState("");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        async function fetchPrompt() {
            try {
                const response = await fetch(`/api/prompts/${params.id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch prompt");
                }

                const data = await response.json();
                setPrompt(data);

                // Extract variables from the prompt content
                const extractedVars = extractVariables(data.content);
                const initialVars: Record<string, string> = {};
                extractedVars.forEach(variable => {
                    initialVars[variable] = "";
                });

                setVariables(initialVars);
                setFinalPrompt(data.content);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching prompt:", error);
                setLoading(false);
            }
        }

        fetchPrompt();
    }, [params.id]);

    useEffect(() => {
        if (prompt) {
            setFinalPrompt(replaceVariables(prompt.content, variables));
        }
    }, [variables, prompt]);

    const handleVariableChange = (variable: string, value: string) => {
        setVariables(prev => ({
            ...prev,
            [variable]: value
        }));
    };

    const handleCopyToClipboard = () => {
        if (!textAreaRef.current) return;

        try {
            // Select the text
            textAreaRef.current.select();
            textAreaRef.current.setSelectionRange(0, 99999); // For mobile devices

            // Try the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(finalPrompt)
                    .then(() => {
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    })
                    .catch(err => {
                        console.error("Clipboard API failed: ", err);
                        // Fall back to document.execCommand
                        fallbackCopyToClipboard();
                    });
            } else {
                // Use the older method as fallback
                fallbackCopyToClipboard();
            }
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    const fallbackCopyToClipboard = () => {
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                console.error('Fallback: Copying text failed');
            }
        } catch (err) {
            console.error('Fallback: Unable to copy', err);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading prompt...</p>
                </div>
            </div>
        );
    }

    if (!prompt) {
        return notFound();
    }

    const extractedVariables = extractVariables(prompt.content);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{prompt.title}</h1>

                {extractedVariables.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Fill in the variables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {extractedVariables.map((variable) => (
                                    <div key={variable} className="mb-4">
                                        <label htmlFor={variable} className="block text-sm font-medium text-gray-700 mb-1">
                                            {variable.charAt(0).toUpperCase() + variable.slice(1)}
                                        </label>
                                        <Input
                                            id={variable}
                                            value={variables[variable] || ""}
                                            onChange={(e) => handleVariableChange(variable, e.target.value)}
                                            placeholder={`Enter ${variable}...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Final Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                            {finalPrompt}
                        </div>
                        {/* Hidden textarea for copying */}
                        <textarea
                            ref={textAreaRef}
                            value={finalPrompt}
                            readOnly
                            className="sr-only"
                            aria-hidden="true"
                        />
                        <div className="mt-4 flex justify-end">
                            <Button onClick={handleCopyToClipboard}>
                                {copied ? "Copied!" : "Copy to Clipboard"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 