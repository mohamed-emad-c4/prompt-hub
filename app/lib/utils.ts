import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extracts variables from a prompt template
 * @param content - The prompt template with variables in {{variable}} format
 * @returns Array of unique variable names
 */
export function extractVariables(content: string): string[] {
    const regex = /\{\{([^{}]+)\}\}/g;
    const matches = content.match(regex) || [];

    // Extract variable names and remove duplicates
    const variables = matches
        .map(match => match.replace(/\{\{|\}\}/g, '').trim())
        .filter((value, index, self) => self.indexOf(value) === index);

    return variables;
}

/**
 * Replaces variables in a prompt template with their values
 * @param content - The prompt template with variables
 * @param variables - Object with variable names as keys and their values
 * @returns The prompt with variables replaced by their values
 */
export function replaceVariables(content: string, variables: Record<string, string>): string {
    let result = content;

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        result = result.replace(regex, value);
    });

    return result;
} 