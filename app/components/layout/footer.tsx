import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container mx-auto px-4 py-6 md:flex md:items-center md:justify-between">
                <div className="text-center md:text-left">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} PromptHub. All rights reserved.
                    </p>
                </div>
                <div className="mt-4 flex justify-center space-x-6 md:mt-0">
                    <Link href="/" className="text-sm text-gray-500 hover:text-primary-600">
                        Home
                    </Link>
                    <Link href="/admin" className="text-sm text-gray-500 hover:text-primary-600">
                        Admin
                    </Link>
                </div>
            </div>
        </footer>
    );
} 