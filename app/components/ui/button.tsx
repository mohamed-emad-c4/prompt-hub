import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/app/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gray-900 text-white hover:bg-gray-800",
                primary: "bg-primary-600 text-white hover:bg-primary-700",
                secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
                accent: "bg-accent-600 text-white hover:bg-accent-700",
                destructive: "bg-red-600 text-white hover:bg-red-700",
                outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-700",
                subtle: "bg-gray-100 text-gray-900 hover:bg-gray-200",
                ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-600",
                link: "text-primary-600 underline-offset-4 hover:underline",
                gradient: "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 animate-gradient bg-size-200",
                glass: "bg-white/20 backdrop-blur-md border border-white/20 text-gray-900 hover:bg-white/30 shadow-glass",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-12 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={isLoading}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                ) : null}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants }; 