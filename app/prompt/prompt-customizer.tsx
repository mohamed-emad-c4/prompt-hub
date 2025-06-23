"use client";

import { useMemo, useState } from 'react';

import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Switch } from '@/app/components/ui/switch';
import type { PromptWithDetails } from '@/app/lib/types';

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
            const isChecked = value === 'true';
            return (
                <div className="flex items-center space-x-2">
                    <Switch
                        id={variable.name}
                        checked={isChecked}
                        onCheckedChange={(checked: boolean) => {
                            onChange(checked ? 'true' : 'false');
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


export function PromptCustomizer({ prompt }: { prompt: PromptWithDetails }) {
    const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
        const initialValues: Record<string, string> = {};
        if (prompt.variables) {
            prompt.variables.forEach(v => {
                if (v.type === 'BOOLEAN') {
                    initialValues[v.name] = v.defaultValue === 'true' ? 'true' : 'false';
                } else {
                    initialValues[v.name] = v.defaultValue ?? '';
                }
            });
        }
        return initialValues;
    });

    const [isCopied, setIsCopied] = useState(false);

    const renderedPrompt = useMemo(() => {
        if (!prompt) return '';
        let content = prompt.content;

        // Create a new map from the prompt's variables for easy lookup.
        const variablesMap = new Map(prompt.variables.map(v => [v.name, v]));

        // Replace placeholders in the content string.
        for (const [key, value] of Object.entries(variableValues)) {
            const variable = variablesMap.get(key);
            if (!variable) continue;

            let replacement;
            if (variable.type === 'BOOLEAN') {
                replacement = value === 'true'
                    ? (variable.textForTrue || '')
                    : (variable.textForFalse || '');
            } else {
                replacement = value;
            }
            // Use a function for replacement to handle all cases, including empty strings
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), () => replacement);
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

    if (!prompt) return null;

    const hasVariables = prompt.variables && prompt.variables.length > 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {hasVariables && (
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

            <div className={hasVariables ? "lg:col-span-2" : "lg:col-span-3"}>
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
    );
} 