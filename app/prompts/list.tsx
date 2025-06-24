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

const PROMPTS_TO_LOAD = 9;

export function PromptsList({ prompts, categories }: PromptsListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(PROMPTS_TO_LOAD);

    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            const matchesCategory = selectedCategory ? prompt.categoryId === parseInt(selectedCategory) : true;
            const matchesSearch = searchTerm
                ? prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase()))
                : true;
            return matchesCategory && matchesSearch;
        });
    }, [prompts, searchTerm, selectedCategory]);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + PROMPTS_TO_LOAD);
    };

    return (
        <div>
            {/* Filter Section */}
            <div className="mb-8 p-4 bg-white/50 backdrop-blur-md rounded-lg border border-gray-200/80 shadow-soft">
                <div className="flex flex-col md:flex-row gap-4">
                    <Input
                        type="text"
                        placeholder="Search prompts by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-md"
                    />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        variant={selectedCategory === '' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('')}
                    >
                        All Categories
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === String(category.id) ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(String(category.id))}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Prompts Grid */}
            {filteredPrompts.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-800">No prompts found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPrompts.slice(0, visibleCount).map(prompt => (
                        <Card key={prompt.id} className="group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-gray-200/80">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">
                                    <Link href={`/prompt/${prompt.id}`} className="hover:text-primary-600 transition-colors stretched-link">
                                        {prompt.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription className="text-sm text-gray-600 h-12 line-clamp-2">
                                    {prompt.description || 'No description available.'}
                                </CardDescription>
                            </CardContent>
                            <CardFooter className="mt-auto pt-4 flex justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                    {prompt.tags.slice(0, 3).map(promptTag => (
                                        <span key={promptTag.tag.id} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                                            {promptTag.tag.name}
                                        </span>
                                    ))}
                                </div>
                                <Button variant="default" size="sm" asChild className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link href={`/customize/${prompt.id}`}>Use</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredPrompts.length && (
                <div className="text-center mt-12">
                    <Button onClick={handleLoadMore} size="lg">
                        Load More Prompts
                    </Button>
                </div>
            )}
        </div>
    );
} 