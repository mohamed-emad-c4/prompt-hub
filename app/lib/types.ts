import { Prisma } from '@prisma/client';

const promptWithDetails = Prisma.validator<Prisma.PromptDefaultArgs>()({
    include: {
        category: true,
        tags: {
            include: {
                tag: true
            }
        }
    },
});

export type PromptWithDetails = Prisma.PromptGetPayload<typeof promptWithDetails> & {
    description?: string | null;
};

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number;
    name: string;
} 