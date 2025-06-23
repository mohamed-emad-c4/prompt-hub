import { db } from "@/app/lib/db";
import { PromptsList } from "./list";
import { PromptWithDetails, Category } from "@/app/lib/types";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

async function getPublishedPrompts(): Promise<PromptWithDetails[]> {
    try {
        const prompts = await db.prompt.findMany({
            where: { isPublished: true },
            orderBy: { updatedAt: "desc" },
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });
        return prompts as PromptWithDetails[];
    } catch (error) {
        console.error("Failed to fetch prompts:", error);
        return [];
    }
}

async function getCategories(): Promise<Category[]> {
    try {
        const categories = await db.category.findMany({
            orderBy: { name: "asc" },
        });
        return categories;
    } catch (error) {
        console.error("Failed to fetch categories:", error);
        return [];
    }
}

export default async function PromptsPage() {
    const prompts = await getPublishedPrompts();
    const categories = await getCategories();

    return (
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Prompts</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Select any prompt to customize it with your own variables.
                </p>
            </div>
            <PromptsList prompts={prompts} categories={categories} />
        </div>
    );
} 