import PromptForm from "../form";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export default function CreatePromptPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Create New Prompt</h1>
                <p className="text-gray-600 mt-2">
                    Create a new prompt template with dynamic variables using the {'{{'} variable {'}}'} syntax.
                </p>
            </div>

            <PromptForm mode="create" />
        </div>
    );
} 