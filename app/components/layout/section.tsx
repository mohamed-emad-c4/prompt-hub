import { cn } from "@/app/lib/utils";
import * as React from 'react'

export function Section({
    children,
    className,
    id,
}: {
    children: React.ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} className={cn("relative py-12 sm:py-16 md:py-20 lg:py-24", className)}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </section>
    );
} 