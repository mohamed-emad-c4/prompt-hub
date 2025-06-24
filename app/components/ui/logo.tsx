import Link from "next/link";

export function Logo() {
    return (
        <Link
            href="/"
            className="flex items-center space-x-2 text-2xl font-bold text-gray-800"
        >
            <div className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
                <svg
                    className="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
            </div>
            <span className="text-xl font-bold bg-clip-text text-black bg-gradient-to-r from-primary-600 to-primary-800">
                PromptHub
            </span>
        </Link>
    );
} 