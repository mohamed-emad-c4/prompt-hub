import Link from "next/link";
import { Logo } from "../ui/logo";
import { GitHubIcon } from "../icons/github-icon";
import { TwitterIcon } from "../icons/twitter-icon";
import { LinkedInIcon } from "../icons/linkedin-icon";

export function Footer() {
    return (
        <footer className="border-t border-white/20 bg-white backdrop-blur-md relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="text-gray-600 mb-4 max-w-md">
                            Create, manage, and use text prompts with dynamic variables for all your content needs.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <TwitterIcon className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                                <span className="sr-only">GitHub</span>
                                <GitHubIcon className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">
                                <span className="sr-only">LinkedIn</span>
                                <LinkedInIcon className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Documentation</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">API Reference</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Examples</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Tutorials</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">About</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/20">
                    <p className="text-gray-500 text-sm text-center">
                        &copy; {new Date().getFullYear()} PromptHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
} 