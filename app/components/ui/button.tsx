import { cn } from "@/app/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            children,
            variant = "primary",
            size = "md",
            isLoading = false,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

        const variants = {
            primary: "bg-primary-600 text-white hover:bg-primary-700",
            secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
            outline: "border border-gray-300 bg-transparent hover:bg-gray-50",
            ghost: "bg-transparent hover:bg-gray-50",
            link: "bg-transparent underline-offset-4 hover:underline text-primary-600",
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-10 px-4 py-2",
            lg: "h-11 px-8 text-lg",
        };

        return (
            <button
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    isLoading && "opacity-70 cursor-not-allowed",
                    className
                )}
                disabled={isLoading || disabled}
                ref={ref}
                {...props}
            >
                {isLoading ? (
                    <span className="mr-2">
                        <svg
                            className="animate-spin h-4 w-4 text-current"
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
                    </span>
                ) : null}
                {children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button }; 