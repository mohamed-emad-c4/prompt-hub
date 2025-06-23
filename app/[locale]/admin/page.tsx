import Link from "next/link";
import { db } from "@/app/lib/db";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { AdminPromptControls } from "./prompt-controls";
import { PromptWithDetails } from "@/app/lib/types";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

async function getPrompts(): Promise<PromptWithDetails[]> {
    try {
        const prompts = await db.prompt.findMany({
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                category: true,
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });
        return prompts as PromptWithDetails[];
    } catch (error) {
        console.error("Failed to fetch prompts:", error);
        return [];
    }
}

export default async function AdminPage() {
    const prompts = await getPrompts();

    return (
        <div className="container mx-auto px-4 py-12 relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-2 text-gray-700">Manage your prompt templates</p>
                    </div>
                    <div className="flex space-x-2">
                        <Link href="/admin/categories">
                            <Button variant="outline">Manage Categories</Button>
                        </Link>
                        <Link href="/admin/prompts/new">
                            <Button
                                variant="gradient"
                                className="shadow-md hover:shadow-lg transition-all"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <div className="flex items-center text-black">
                                    Create New Prompt
                                </div>
                            </Button>
                        </Link>
                    </div>
                </div>

                {prompts.length === 0 ? (
                    <Card className="text-center p-12 card-glass">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No prompts created yet</h3>
                        <p className="mt-2 text-gray-600 max-w-md mx-auto">Get started by creating your first prompt template.</p>
                        <div className="mt-6">
                            <Link href="/admin/prompts/new">
                                <Button variant="primary">Create Your First Prompt</Button>
                            </Link>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map((prompt) => (
                            <Card
                                key={prompt.id}
                                className="overflow-hidden hover:shadow-card transition-all duration-300 card-glass"
                            >
                                <div className={`h-1.5 w-full ${prompt.isPublished ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="mr-2">{prompt.title}</CardTitle>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${prompt.isPublished
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {prompt.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <CardDescription className="text-gray-600">
                                        {prompt.category?.name} &middot; Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-3 text-gray-700">
                                        {prompt.content}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {prompt.tags.map(promptTag => (
                                            <span key={promptTag.tag.id} className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {promptTag.tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center bg-white/20 backdrop-blur-sm p-4 card-glass">
                                    <AdminPromptControls prompt={prompt} />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 