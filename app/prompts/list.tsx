"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { PromptWithDetails, Category } from '@/app/lib/types';
import { Button } from '@/app/components/ui/button';

interface PromptsListProps {
    prompts: PromptWithDetails[];
    categories: Category[];
}

export function PromptsList({ prompts, categories }: PromptsListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            const matchesCategory = selectedCategory ? prompt.categoryId === parseInt(selectedCategory) : true;
            const matchesSearch = searchTerm ? prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) : true;
            return matchesCategory && matchesSearch;
        });
    }, [prompts, searchTerm, selectedCategory]);

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <Input
                    type="text"
                    placeholder="Search prompts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-xs"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            {filteredPrompts.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-lg font-medium">No prompts found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPrompts.map(prompt => (
                        <Card key={prompt.id} className="group flex flex-col">
                            <CardHeader>
                                <CardTitle>
                                    <Link href={`/prompt/${prompt.id}`} className="hover:text-primary-600 transition-colors">
                                        {prompt.title}
                                    </Link>
                                </CardTitle>
                                <CardDescription className="pt-2 h-12 overflow-hidden">
                                    {prompt.content}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto pt-4 flex justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                    {prompt.tags.map(promptTag => (
                                        <span key={promptTag.tag.id} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                            {promptTag.tag.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/prompts/${prompt.id}`}>Edit</Link>
                                    </Button>
                                    <Button variant="primary" size="sm" asChild>
                                        <Link href={`/customize/${prompt.id}`}>Use</Link>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
} 