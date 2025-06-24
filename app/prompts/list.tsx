"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { PromptWithDetails, Category } from '@/app/lib/types';
import { Button } from '@/app/components/ui/button';
import { SearchXIcon } from '@/app/components/icons/search-x-icon';

interface PromptsListProps {
    prompts: PromptWithDetails[];
    categories: Category[];
}

const PROMPTS_TO_LOAD = 9;

export function PromptsList({ prompts, categories }: PromptsListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState(PROMPTS_TO_LOAD);
    const [sortOrder, setSortOrder] = useState('newest');

    const filteredAndSortedPrompts = useMemo(() => {
        const filtered = prompts.filter(prompt => {
            const matchesCategory = selectedCategory ? prompt.categoryId === parseInt(selectedCategory) : true;
            const matchesSearch = searchTerm
                ? prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase()))
                : true;
            return matchesCategory && matchesSearch;
        });

        const sorted = [...filtered].sort((a, b) => {
            switch (sortOrder) {
                case 'oldest':
                    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                case 'newest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return sorted;
    }, [prompts, searchTerm, selectedCategory, sortOrder]);

    const handleLoadMore = () => {
        setVisibleCount(prevCount => prevCount + PROMPTS_TO_LOAD);
    };

    return (
        <div>
            {/* Filter Section */}
            <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200/80 shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Filter & Sort Prompts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="newest">Sort by Newest</option>
                        <option value="oldest">Sort by Oldest</option>
                        <option value="title-asc">Sort by Title (A-Z)</option>
                        <option value="title-desc">Sort by Title (Z-A)</option>
                    </select>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant={selectedCategory === '' ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory('')}
                    >
                        All Categories
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            size="sm"
                            variant={selectedCategory === String(category.id) ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(String(category.id))}
                        >
                            {category.name}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Prompts Grid */}
            {filteredAndSortedPrompts.length === 0 ? (
                <div className="text-center py-16">
                    <SearchXIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">No prompts found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAndSortedPrompts.slice(0, visibleCount).map(prompt => (
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
                                        <span key={promptTag.tag.id} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full border-2 border-gray-200">
                                            {promptTag.tag.name}
                                        </span>
                                    ))}
                                </div>
                                <Button variant="outline" size="sm" >
                                    <Link href={`/customize/${prompt.id}`}>Use</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {visibleCount < filteredAndSortedPrompts.length && (
                <div className="text-center mt-12">
                    <Button onClick={handleLoadMore} size="lg">
                        Load More Prompts
                    </Button>
                </div>
            )}
        </div>
    );
} 