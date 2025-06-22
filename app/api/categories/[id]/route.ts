import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";

interface RouteParams {
    params: { id: string };
}

export async function DELETE(request: Request, { params }: RouteParams) {
    try {
        const categoryId = parseInt(params.id);
        if (isNaN(categoryId)) {
            return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
        }

        // Optional: Check if any prompts are using this category before deleting
        const promptsInCategory = await db.prompt.count({
            where: { categoryId },
        });

        if (promptsInCategory > 0) {
            return NextResponse.json(
                { error: `Cannot delete category as it is currently assigned to ${promptsInCategory} prompt(s). Please reassign them first.` },
                { status: 409 } // 409 Conflict
            );
        }

        await db.category.delete({
            where: { id: categoryId },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Failed to delete category" },
            { status: 500 }
        );
    }
} 