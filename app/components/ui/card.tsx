import { cn } from "@/app/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    glass?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, glass = false, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border transition-all duration-200",
                glass
                    ? "bg-white/70 backdrop-blur-md border-white/20 shadow-glass"
                    : "bg-white border-gray-200 shadow-soft",
                className
            )}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex flex-col space-y-1.5 p-6", className)}
                {...props}
            />
        );
    }
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
    HTMLHeadingElement,
    HTMLAttributes<HTMLHeadingElement>
>(
    ({ className, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={cn(
                    "text-xl font-semibold leading-tight tracking-tight text-gray-900 transition-colors",
                    className
                )}
                {...props}
            />
        );
    }
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
    HTMLParagraphElement,
    HTMLAttributes<HTMLParagraphElement>
>(
    ({ className, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={cn("text-sm text-gray-500", className)}
                {...props}
            />
        );
    }
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(
    ({ className, ...props }, ref) => {
        return (
            <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
        );
    }
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
    HTMLDivElement,
    HTMLAttributes<HTMLDivElement>
>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("flex items-center p-6 pt-0", className)}
                {...props}
            />
        );
    }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }; 