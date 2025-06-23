import { db } from "@/app/lib/db";
import { Card } from "@/app/components/ui/card";
import { CategoryClientManager } from "./manager";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

async function getCategories() {
    return db.category.findMany({
        orderBy: { name: 'asc' }
    });
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                    <p className="mt-2 text-gray-600">Add, edit, or delete prompt categories.</p>
                </div>
                <Link href="/admin">
                    <Button variant="outline">
                        Back to Dashboard
                    </Button>
                </Link>
            </div>
            <Card className="p-6">
                <CategoryClientManager initialCategories={categories} />
            </Card>
        </div>
    );
} 