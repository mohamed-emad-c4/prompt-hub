"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { extractVariables, replaceVariables } from "@/app/lib/utils";

interface Prompt {
    id: string;
    title: string;
    content: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function PromptPage() {
    const params = useParams();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [finalPrompt, setFinalPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchPrompt() {
            if (!params.id) return;

            try {
                setIsLoading(true);
                const response = await fetch(`/api/prompts/${params.id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch prompt");
                }

                const data = await response.json();
                setPrompt(data);

                // Extract variables from content
                const extractedVars = extractVariables(data.content);
                const initialVars: Record<string, string> = {};
                extractedVars.forEach(v => {
                    initialVars[v] = "";
                });

                setVariables(initialVars);
                setFinalPrompt(data.content);
            } catch (err) {
                console.error("Error fetching prompt:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setIsLoading(false);
            }
        }

        fetchPrompt();
    }, [params.id]);

    const handleVariableChange = (name: string, value: string) => {
        setVariables(prev => {
            const updated = { ...prev, [name]: value };

            // Update final prompt
            if (prompt) {
                setFinalPrompt(replaceVariables(prompt.content, updated));
            }

            return updated;
        });
    };

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(finalPrompt);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement("textarea");
                textArea.value = finalPrompt;
                textArea.style.position = "fixed";
                textArea.style.left = "-999999px";
                textArea.style.top = "-999999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand("copy");
                textArea.remove();
            }

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-primary-200 mb-4"></div>
                        <div className="text-primary-600 font-medium">Loading prompt...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                {error || "Prompt not found"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const variablesList = Object.keys(variables);

    return (
        <div className="container mx-auto px-4 py-12 relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
                    <p className="text-gray-500">
                        Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Variables Panel */}
                    <div className="lg:col-span-2">
                        <Card glass className="backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl">Customize Variables</CardTitle>
                                <CardDescription>
                                    Fill in the values below to personalize your prompt
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                {variablesList.length === 0 ? (
                                    <p className="text-gray-500 italic">This prompt has no variables to customize.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {variablesList.map((varName) => (
                                            <div key={varName} className="space-y-1">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {varName}
                                                </label>
                                                <Input
                                                    type="text"
                                                    value={variables[varName]}
                                                    onChange={(e) => handleVariableChange(varName, e.target.value)}
                                                    placeholder={`Enter value for ${varName}`}
                                                    className="w-full border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-3">
                        <Card glass className="backdrop-blur-sm">
                            <CardHeader className="border-b border-white/20">
                                <CardTitle>Preview</CardTitle>
                                <CardDescription>
                                    The final prompt with your variables applied
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20 min-h-[200px] whitespace-pre-wrap mb-4 shadow-sm">
                                    {finalPrompt}
                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        onClick={copyToClipboard}
                                        variant="primary"
                                        className="flex items-center gap-2 shadow-md hover:shadow-lg"
                                        disabled={copied}
                                    >
                                        {copied ? (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                                Copy to Clipboard
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6 bg-primary-50/70 backdrop-blur-sm rounded-lg p-4 border border-primary-100/50 shadow-glass">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <svg className="h-5 w-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-primary-800">How to use this prompt</h3>
                                    <div className="mt-2 text-sm text-primary-700">
                                        <p>Fill in the variables on the left to customize this prompt template. The preview will update automatically as you type. When you're done, click "Copy to Clipboard" to use the prompt in your favorite applications.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 