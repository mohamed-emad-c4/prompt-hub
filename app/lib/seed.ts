import { db } from "./db";

async function seed() {
    try {
        // Delete existing data
        await db.prompt.deleteMany({});

        // Create sample prompts
        const prompts = [
            {
                title: "Website Content Brief",
                content: "Create a responsive modern website for a {{industry}} that includes a {{homepage}}, {{about us}}, and {{services}} page.",
                isPublished: true,
            },
            {
                title: "Marketing Email",
                content: "Subject: Introducing our new {{product}} for {{target audience}}\n\nDear {{name}},\n\nWe're excited to announce our new {{product}} designed specifically for {{target audience}} like you.\n\nOur {{product}} helps you {{benefit}} without the hassle of {{pain point}}.\n\nLearn more at {{website}}.\n\nBest regards,\n{{company name}}",
                isPublished: true,
            },
            {
                title: "Blog Post Outline",
                content: "# {{blog title}}\n\n## Introduction\n- Hook about {{topic}}\n- Why {{topic}} matters for {{audience}}\n- Thesis statement: {{main point}}\n\n## Section 1: {{subtopic 1}}\n- Key point 1\n- Key point 2\n- Example\n\n## Section 2: {{subtopic 2}}\n- Key point 1\n- Key point 2\n- Case study\n\n## Section 3: {{subtopic 3}}\n- Key point 1\n- Key point 2\n- Actionable tips\n\n## Conclusion\n- Recap of {{main point}}\n- Call to action: {{desired action}}",
                isPublished: true,
            },
            {
                title: "Product Description",
                content: "Introducing the {{product name}} - the ultimate {{product category}} for {{target user}}.\n\nCrafted with {{material/technology}}, our {{product name}} offers unparalleled {{benefit 1}} and {{benefit 2}}.\n\nWhether you're {{use case 1}} or {{use case 2}}, the {{product name}} delivers exceptional performance every time.\n\nFeatures:\n- {{feature 1}}\n- {{feature 2}}\n- {{feature 3}}\n\nAvailable in {{color/size/variant}} options. Order now and experience the difference!",
                isPublished: false,
            },
        ];

        for (const prompt of prompts) {
            await db.prompt.create({
                data: prompt,
            });
        }

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await db.$disconnect();
    }
}

seed(); 