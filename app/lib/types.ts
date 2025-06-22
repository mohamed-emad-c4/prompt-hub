import { Prisma } from '@prisma/client';

const promptWithDetails = Prisma.validator<Prisma.PromptDefaultArgs>()({
    include: { category: true, tags: true },
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