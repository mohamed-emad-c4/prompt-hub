"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface Category {
    id: number;
    name: string;
}

interface CategoryClientManagerProps {
    initialCategories: Category[];
}

export function CategoryClientManager({ initialCategories }: CategoryClientManagerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!newCategoryName.trim()) {
            setError("Category name cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });
            const newCategory = await response.json();
            if (!response.ok) {
                throw new Error(newCategory.error || "Failed to create category");
            }
            setCategories([...categories, newCategory]);
            setNewCategoryName("");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || "Failed to delete category");
            }
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        }
    };

    return (
        <div>
            <form onSubmit={handleCreate} className="flex items-center space-x-4 mb-8">
                <Input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className="flex-grow"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Category"}
                </Button>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="space-y-3">
                {categories.map(category => (
                    <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <span className="font-medium text-gray-800">{category.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
} 