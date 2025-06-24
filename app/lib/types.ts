import { Prisma } from '@prisma/client';

// This validator is used only for type generation
// @ts-expect-error - used for type generation
const promptWithDetails = Prisma.validator<Prisma.PromptDefaultArgs>()({
    include: {
        category: true,
        tags: {
            include: {
                tag: true
            }
        },
        variables: true
    },
});

export type PromptWithDetails = Prisma.PromptGetPayload<typeof promptWithDetails>;

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
} 