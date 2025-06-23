"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { X } from "lucide-react";

interface Category {
    id: number;
    name: string;
}

interface Tag {
    id: number;
    name: string;
}

interface PromptVariable {
    id?: number;
    name: string;
    type: 'TEXT' | 'BOOLEAN' | 'SELECT';
    options?: string; // Comma-separated for SELECT
    defaultValue?: string;
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
        variables?: PromptVariable[];
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
    const [promptVariables, setPromptVariables] = useState<PromptVariable[]>(prompt?.variables || []);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // For preview
    const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});
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

    // Sync preview variables with prompt variables and their default values
    useEffect(() => {
        const newPreviewVars: Record<string, string> = {};
        promptVariables.forEach(v => {
            // Set initial preview value from default, but don't overwrite if already set by user
            newPreviewVars[v.name] = previewVariables[v.name] ?? v.defaultValue ?? "";
        });
        setPreviewVariables(newPreviewVars);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promptVariables]);

    // Update preview content when content or preview variables change
    useEffect(() => {
        let finalContent = content;
        for (const [key, value] of Object.entries(previewVariables)) {
            if (key) { // Ensure key is not an empty string
                finalContent = finalContent.replace(new RegExp(`{{${key}}}`, 'g'), value);
            }
        }
        setPreviewContent(finalContent);
    }, [content, previewVariables]);


    const handlePreviewVariableChange = (variable: string, value: string) => {
        setPreviewVariables(prev => ({ ...prev, [variable]: value }));
    };

    const addVariable = () => {
        setPromptVariables([...promptVariables, { name: "", type: 'TEXT', defaultValue: "" }]);
    };

    const updateVariable = (index: number, field: keyof PromptVariable, value: string) => {
        const newVariables = [...promptVariables];
        const variableToUpdate = { ...newVariables[index] };

        (variableToUpdate[field] as any) = value;

        // Reset options if type is not SELECT
        if (field === 'type' && value !== 'SELECT') {
            variableToUpdate.options = '';
        }

        // Reset default value if type is BOOLEAN
        if (field === 'type' && value === 'BOOLEAN') {
            variableToUpdate.defaultValue = 'false';
        }


        newVariables[index] = variableToUpdate;
        setPromptVariables(newVariables);
    };

    const removeVariable = (index: number) => {
        const newVariables = promptVariables.filter((_, i) => i !== index);
        setPromptVariables(newVariables);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!title.trim() || !content.trim() || !categoryId) {
            setError("Title, content, and category are required.");
            return;
        }

        // Validate variables
        for (const v of promptVariables) {
            if (!v.name.trim()) {
                setError("All variables must have a name.");
                return;
            }
            if (v.type === 'SELECT' && (!v.options || !v.options.trim())) {
                setError(`Variable "${v.name}" is a SELECT type but has no options.`);
                return;
            }
        }


        setIsSubmitting(true);

        try {
            const url = mode === "create" ? "/api/prompts" : `/api/prompts/${prompt?.id}`;
            const method = mode === "create" ? "POST" : "PUT";
            const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            const variablesToSave = promptVariables.map(v => ({
                name: v.name,
                type: v.type,
                defaultValue: v.defaultValue,
                // Make sure options are only sent for SELECT type
                options: v.type === 'SELECT' ? v.options?.split(',').map(s => s.trim()).filter(Boolean) : undefined,
            }));

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
                    variables: variablesToSave,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save prompt");
            }

            router.refresh();
            router.push("/admin");

        } catch (error: any) {
            console.error("Error saving prompt:", error);
            setError(error.message || "Failed to save prompt. Please try again.");
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
                            Content (use {'{{variable_name}}'} for dynamic parts)
                        </label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="e.g. Write a marketing email to {{customer_name}} about our new product, {{product_name}}."
                            className="min-h-[200px]"
                        />
                    </div>

                    {/* START: Variables Section */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Prompt Variables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {promptVariables.map((variable, index) => (
                                    <div key={index} className="p-4 border rounded-md space-y-3 bg-gray-50/50">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">Variable #{index + 1}</p>
                                            <Button variant="ghost" size="icon" onClick={() => removeVariable(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Name</label>
                                                <Input
                                                    value={variable.name}
                                                    onChange={(e) => updateVariable(index, 'name', e.target.value)}
                                                    placeholder="e.g. customer_name"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Type</label>
                                                <select
                                                    value={variable.type}
                                                    onChange={(e) => updateVariable(index, 'type', e.target.value as PromptVariable['type'])}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border p-2"
                                                >
                                                    <option value="TEXT">Text</option>
                                                    <option value="BOOLEAN">Checkbox (True/False)</option>
                                                    <option value="SELECT">Dropdown</option>
                                                </select>
                                            </div>
                                        </div>
                                        {variable.type !== 'BOOLEAN' && (
                                            <div>
                                                <label className="text-sm font-medium">Default Value</label>
                                                <Input
                                                    value={variable.defaultValue}
                                                    onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                                                    placeholder="Enter a default value"
                                                />
                                            </div>
                                        )}
                                        {variable.type === 'BOOLEAN' && (
                                            <div className="flex items-center space-x-2 pt-2">
                                                <label className="text-sm font-medium">Default Value:</label>
                                                <select
                                                    value={variable.defaultValue}
                                                    onChange={(e) => updateVariable(index, 'defaultValue', e.target.value)}
                                                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10 border p-2"
                                                >
                                                    <option value={'false'}>False</option>
                                                    <option value={'true'}>True</option>
                                                </select>
                                            </div>
                                        )}
                                        {variable.type === 'SELECT' && (
                                            <div>
                                                <label className="text-sm font-medium">Options (comma-separated)</label>
                                                <Textarea
                                                    value={variable.options}
                                                    onChange={(e) => updateVariable(index, 'options', e.target.value)}
                                                    placeholder="e.g. Option 1, Option 2, Option 3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                className="mt-4"
                                onClick={addVariable}
                            >
                                Add Variable
                            </Button>
                        </CardContent>
                    </Card>
                    {/* END: Variables Section */}


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
            <div className="sticky top-8 self-start">
                <Card className="card-glass">
                    <CardHeader>
                        <CardTitle>Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-gray-50/50 min-h-[150px] whitespace-pre-wrap">
                            {previewContent}
                        </div>
                        {Object.keys(previewVariables).length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-700 mb-4">
                                    Test Variables
                                </h3>
                                <div className="space-y-4">
                                    {promptVariables.map((variable) => (
                                        <div key={variable.name}>
                                            <label htmlFor={`var-${variable.name}`} className="block text-sm font-medium text-gray-600 capitalize">
                                                {variable.name.replace(/_/g, ' ')}
                                            </label>
                                            <Input
                                                id={`var-${variable.name}`}
                                                value={previewVariables[variable.name] || ''}
                                                onChange={(e) => handlePreviewVariableChange(variable.name, e.target.value)}
                                                placeholder={`Enter value for ${variable.name}`}
                                                className="mt-1"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}