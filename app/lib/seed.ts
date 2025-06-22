import { db } from "./db";
import bcrypt from "bcryptjs";

async function seed() {
    try {
        // Clear existing data
        await db.prompt.deleteMany({});
        await db.user.deleteMany({});
        await db.category.deleteMany({});
        await db.tag.deleteMany({});

        // Create a default admin user
        const hashedPassword = await bcrypt.hash("password123", 10);
        await db.user.create({
            data: {
                email: "admin@example.com",
                password: hashedPassword,
                isAdmin: true,
            },
        });

        // Create sample categories
        const marketingCategory = await db.category.create({ data: { name: 'Marketing' } });
        const contentCategory = await db.category.create({ data: { name: 'Content Creation' } });
        const webDevCategory = await db.category.create({ data: { name: 'Web Development' } });

        // Create sample tags
        const emailTag = await db.tag.create({ data: { name: 'Email' } });
        const socialMediaTag = await db.tag.create({ data: { name: 'Social Media' } });
        const blogTag = await db.tag.create({ data: { name: 'Blog' } });
        const websiteTag = await db.tag.create({ data: { name: 'Website' } });

        // Create sample prompts
        const prompts = [
            {
                title: "Website Content Brief",
                content: "Create a responsive modern website for a {{industry}} that includes a {{homepage}}, {{about us}}, and {{services}} page.",
                isPublished: true,
                categoryId: webDevCategory.id,
                tags: { connect: [{ id: websiteTag.id }] },
            },
            {
                title: "Marketing Email",
                content: "Subject: Introducing our new {{product}} for {{target audience}}\n\nDear {{name}},\n\nWe're excited to announce our new {{product}} designed specifically for {{target audience}} like you.\n\nOur {{product}} helps you {{benefit}} without the hassle of {{pain point}}.\n\nLearn more at {{website}}.\n\nBest regards,\n{{company name}}",
                isPublished: true,
                categoryId: marketingCategory.id,
                tags: { connect: [{ id: emailTag.id }, { id: socialMediaTag.id }] },
            },
            {
                title: "Blog Post Outline",
                content: "# {{blog title}}\n\n## Introduction\n- Hook about {{topic}}\n- Why {{topic}} matters for {{audience}}\n- Thesis statement: {{main point}}\n\n## Section 1: {{subtopic 1}}\n- Key point 1\n- Key point 2\n- Example\n\n## Section 2: {{subtopic 2}}\n- Key point 1\n- Key point 2\n- Case study\n\n## Section 3: {{subtopic 3}}\n- Key point 1\n- Key point 2\n- Actionable tips\n\n## Conclusion\n- Recap of {{main point}}\n- Call to action: {{desired action}}",
                isPublished: true,
                categoryId: contentCategory.id,
                tags: { connect: [{ id: blogTag.id }] },
            },
            {
                title: "Product Description",
                content: "Introducing the {{product name}} - the ultimate {{product category}} for {{target user}}.\n\nCrafted with {{material/technology}}, our {{product name}} offers unparalleled {{benefit 1}} and {{benefit 2}}.\n\nWhether you're {{use case 1}} or {{use case 2}}, the {{product name}} delivers exceptional performance every time.\n\nFeatures:\n- {{feature 1}}\n- {{feature 2}}\n- {{feature 3}}\n\nAvailable in {{color/size/variant}} options. Order now and experience the difference!",
                isPublished: false,
                categoryId: marketingCategory.id,
                tags: { connect: [{ id: websiteTag.id }] },
            },
        ];

        for (const promptData of prompts) {
            await db.prompt.create({
                data: promptData,
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