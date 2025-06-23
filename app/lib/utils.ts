import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface PromptVariable {
    name: string;
    type: 'text' | 'select' | 'toggle';
    options: string[];
    fullMatch: string; // The full {{...}} string
}

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
export function extractVariables(content: string): PromptVariable[] {
    const regex = /\{\{([^{}]+?)\}\}/g;
    const matches = content.match(regex) || [];

    const variables = matches.map(match => {
        const trimmedMatch = match.slice(2, -2).trim();
        const parts = trimmedMatch.split('|').map(p => p.trim());
        const name = parts[0];
        const type = (parts[1] || 'text').toLowerCase();
        const options = parts[2] ? parts[2].split(',').map(o => o.trim()) : [];

        if (type === 'select' || type === 'toggle') {
            return { name, type, options, fullMatch: match };
        }
        return { name, type: 'text', options: [], fullMatch: match };
    });

    // Deduplicate based on the full match to handle identical variables
    const uniqueVariables = Array.from(new Map(variables.map(v => [v.fullMatch, v])).values());

    return uniqueVariables;
}

/**
 * Replaces variables in a prompt template with their values
 * @param content - The prompt template with variables
 * @param variableValues - Object with variable names as keys and their values
 * @returns The prompt with variables replaced by their values
 */
export function replaceVariables(content: string, variableValues: Record<string, string>): string {
    let result = content;

    Object.entries(variableValues).forEach(([key, value]) => {
        // The key is the fullMatch, e.g., "{{tone|select|formal,casual}}"
        // We need to escape it for the regex
        const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escapedKey, 'g');
        result = result.replace(regex, value);
    });

    return result;
} 