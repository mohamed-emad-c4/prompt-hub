"use client";

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { PromptWithDetails } from '@/app/lib/types';
import Link from 'next/link';

// This should match the type from prisma schema
interface PromptVariable {
    id: number;
    name: string;
    type: 'TEXT' | 'BOOLEAN' | 'SELECT';
    options: any; // It will be a JSON array of strings for SELECT
    defaultValue: string | null;
    textForTrue: string | null;
    textForFalse: string | null;
}

function VariableControl({ variable, value, onChange }: { variable: PromptVariable, value: string, onChange: (value: string) => void }) {
    switch (variable.type) {
        case 'BOOLEAN':
            const isChecked = value === (variable.textForTrue || '');
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        id={variable.name}
                        checked={isChecked}
                        onCheckedChange={(checked: boolean) => {
                            onChange(checked ? (variable.textForTrue || '') : (variable.textForFalse || ''));
                        }}
                    />
                    <label htmlFor={variable.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                        {variable.name.replace(/_/g, ' ')}
                    </label>
                </div>
            );
        case 'SELECT':
            const options = Array.isArray(variable.options) ? variable.options : [];
            return (
                <div className="grid gap-2">
                    <label htmlFor={variable.name} className="text-sm font-medium capitalize">{variable.name.replace(/_/g, ' ')}</label>
                    <select
                        id={variable.name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        {options.map((option: string) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            );
        case 'TEXT':
        default:
            return (
                <div className="grid gap-2">
                    <label htmlFor={variable.name} className="text-sm font-medium capitalize">{variable.name.replace(/_/g, ' ')}</label>
                    <Input
                        id={variable.name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Enter value for ${variable.name}...`}
                    />
                </div>
            );
    }
}

export default function PromptPage() {
    const params = useParams();
    const id = params.id as string;

    const [prompt, setPrompt] = useState<PromptWithDetails | null>(null);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
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

                // Ensure variables is an array
                if (fetchedPrompt && !Array.isArray(fetchedPrompt.variables)) {
                    fetchedPrompt.variables = [];
                }

                setPrompt(fetchedPrompt);

                const initialValues: Record<string, string> = {};
                if (fetchedPrompt.variables) {
                    fetchedPrompt.variables.forEach(v => {
                        if (v.type === 'BOOLEAN') {
                            const isCheckedByDefault = v.defaultValue === 'true';
                            initialValues[v.name] = isCheckedByDefault ? (v.textForTrue || '') : (v.textForFalse || '');
                        } else {
                            initialValues[v.name] = v.defaultValue ?? '';
                        }
                    });
                }
                setVariableValues(initialValues);

            } catch (error) {
                console.error("Failed to fetch prompt", error);
                setPrompt(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, [id]);

    const renderedPrompt = useMemo(() => {
        if (!prompt) return '';
        let content = prompt.content;
        for (const [key, value] of Object.entries(variableValues)) {
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return content;
    }, [variableValues, prompt]);

    const handleVariableChange = (name: string, value: string) => {
        setVariableValues(prev => ({ ...prev, [name]: value }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(renderedPrompt);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!prompt) return <div className="flex justify-center items-center h-screen">Prompt not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <Link href="/prompts" className="text-primary-600 hover:underline flex items-center">
                    &larr; Back to Prompts
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {prompt.variables && prompt.variables.length > 0 && (
                    <div className="lg:col-span-1">
                        <Card className="card-glass sticky top-24">
                            <CardHeader>
                                <CardTitle>Configure Variables</CardTitle>
                                <CardDescription>Adjust the settings to tailor the prompt.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {prompt.variables.map(variable => (
                                    <VariableControl
                                        key={variable.id}
                                        variable={variable}
                                        value={variableValues[variable.name] || ''}
                                        onChange={(value) => handleVariableChange(variable.name, value)}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className={prompt.variables && prompt.variables.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
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
                                    <h3 className="font-semibold mb-2 text-lg">Final Prompt</h3>
                                    <pre className="min-h-[300px] bg-white/50 font-mono text-sm border-gray-300 p-4 rounded-md whitespace-pre-wrap">
                                        {renderedPrompt}
                                    </pre>
                                </div>
                                <Button onClick={handleCopy} className="w-full transition-all" variant={isCopied ? "secondary" : "primary"}>
                                    {isCopied ? 'Copied!' : 'Copy to Clipboard'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 