"use client";

import { useEffect, useState } from 'react';
import { extractVariables, replaceVariables, PromptVariable } from '@/app/lib/utils';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import type { PromptWithDetails } from '@/app/lib/types';
import Link from 'next/link';

function VariableControl({ variable, value, onChange }: { variable: PromptVariable, value: string, onChange: (value: string) => void }) {
    switch (variable.type) {
        case 'toggle':
            const isChecked = value === variable.options[0];
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        id={variable.name}
                        checked={isChecked}
                        onCheckedChange={(checked: boolean) => {
                            onChange(checked ? variable.options[0] : (variable.options[1] || ''));
                        }}
                    />
                    <label htmlFor={variable.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {variable.name}
                    </label>
                </div>
            );
        case 'select':
            return (
                <div className="grid gap-2">
                    <label htmlFor={variable.name} className="text-sm font-medium">{variable.name}</label>
                    <select
                        id={variable.name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        {variable.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            );
        case 'text':
        default:
            return (
                <div className="grid gap-2">
                    <label htmlFor={variable.name} className="text-sm font-medium">{variable.name}</label>
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

export default function PromptPage({ params }: { params: { id: string } }) {
    const [prompt, setPrompt] = useState<PromptWithDetails | null>(null);
    const [variables, setVariables] = useState<PromptVariable[]>([]);
    const [variableValues, setVariableValues] = useState<Record<string, string>>({});
    const [renderedPrompt, setRenderedPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrompt = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/prompts/${params.id}`);
                if (!response.ok) {
                    throw new Error('Prompt not found');
                }
                const fetchedPrompt: PromptWithDetails = await response.json();

                if (fetchedPrompt) {
                    setPrompt(fetchedPrompt);
                    const extracted = extractVariables(fetchedPrompt.content);
                    setVariables(extracted);

                    // Initialize state
                    const initialValues: Record<string, string> = {};
                    extracted.forEach(v => {
                        if (v.type === 'select') {
                            initialValues[v.fullMatch] = v.options[0] || '';
                        } else if (v.type === 'toggle') {
                            initialValues[v.fullMatch] = v.options[1] || ''; // Default to OFF value
                        } else {
                            initialValues[v.fullMatch] = '';
                        }
                    });

                    setVariableValues(initialValues);
                    setRenderedPrompt(replaceVariables(fetchedPrompt.content, initialValues));
                }
            } catch (error) {
                console.error("Failed to fetch prompt", error);
                setPrompt(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrompt();
    }, [params.id]);

    useEffect(() => {
        if (prompt) {
            const newRenderedPrompt = replaceVariables(prompt.content, variableValues);
            setRenderedPrompt(newRenderedPrompt);
        }
    }, [variableValues, prompt]);

    const handleVariableChange = (fullMatch: string, value: string) => {
        setVariableValues(prev => ({ ...prev, [fullMatch]: value }));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(renderedPrompt);
        // Add toast notification here later
    };

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!prompt) return <div className="p-8">Prompt not found.</div>;

    return (
        <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Configure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {variables.length > 0 ? (
                            variables.map(variable => (
                                <VariableControl
                                    key={variable.fullMatch}
                                    variable={variable}
                                    value={variableValues[variable.fullMatch]}
                                    onChange={(value) => handleVariableChange(variable.fullMatch, value)}
                                />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">This prompt has no configurable variables.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{prompt.title}</CardTitle>
                        <p className="text-sm text-gray-500 pt-2">{prompt.description || 'No description available.'}</p>
                        <div className="pt-2 text-sm text-gray-600">
                            Category: <Link href={`/category/${prompt.category?.id ?? ''}`} className="font-semibold text-primary-600 hover:underline">{prompt.category?.name ?? 'Uncategorized'}</Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Final Prompt</h3>
                                <Textarea
                                    value={renderedPrompt}
                                    readOnly
                                    className="min-h-[250px] bg-gray-50 font-mono text-sm"
                                />
                            </div>
                            <Button onClick={handleCopy}>
                                Copy to Clipboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 