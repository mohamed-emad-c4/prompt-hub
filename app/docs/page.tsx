import { Section } from "@/app/components/layout/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { EditIcon } from "@/app/components/icons/edit-icon";
import { EyeIcon } from "@/app/components/icons/eye-icon";
import { CopyIcon } from "@/app/components/icons/copy-icon";

export default function DocsPage() {
    return (
        <div className="bg-white">
            <Section className="bg-gray-50">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        How to Use PromptHub
                    </h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        Your guide to creating perfectly tailored text in just a few clicks.
                    </p>
                </div>
            </Section>

            <Section className="py-16 sm:py-20">
                <div className="prose prose-lg max-w-4xl mx-auto">
                    <h2 className="text-center">Welcome to Simple, Powerful Prompts</h2>
                    <p>
                        Think of PromptHub as a collection of smart templates. You choose a template (we call them "Prompts"), fill in a few fields, and get a perfectly formatted piece of text ready to use anywhere. It's like a mail merge, but for everything else!
                    </p>

                    <hr className="my-12" />

                    <h2>What are Variables?</h2>
                    <p>
                        "Variables" are the blank fields in our templates. Each prompt has different types of variables to help you customize the final text. Here are the types you'll see:
                    </p>

                    <div className="not-prose grid md:grid-cols-3 gap-8 my-8 text-center">
                        <div className="p-6 border rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <EditIcon className="h-6 w-6 text-primary-600" />
                            </div>
                            <h3 className="font-semibold text-lg">Text Fields</h3>
                            <p className="text-sm text-gray-600">A simple text box for you to type anything you want, like a name, a topic, or a specific instruction.</p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                            </div>
                            <h3 className="font-semibold text-lg">On/Off Switches</h3>
                            <p className="text-sm text-gray-600">A simple switch to turn a feature or a piece of text on or off. Flip it to include or exclude certain details.</p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>
                            </div>
                            <h3 className="font-semibold text-lg">Dropdown Menus</h3>
                            <p className="text-sm text-gray-600">A list of predefined options to choose from, like picking a tone (e.g., Formal, Casual) or a format.</p>
                        </div>
                    </div>

                    <hr className="my-12" />

                    <h2 className="text-center">Your 3-Step Guide to Perfect Prompts</h2>
                    <div className="not-prose grid md:grid-cols-3 gap-8 my-12 text-center">
                        <div className="p-4">
                            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold">1</div>
                            <h3 className="font-semibold text-xl">Choose a Prompt</h3>
                            <p className="text-gray-600">Browse the library and click on any prompt to get started.</p>
                        </div>
                        <div className="p-4">
                            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold">2</div>
                            <h3 className="font-semibold text-xl">Fill in the Blanks</h3>
                            <p className="text-gray-600">Use the form to fill in the variables. You'll see the final text update in the live preview area.</p>
                        </div>
                        <div className="p-4">
                            <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto text-2xl font-bold">3</div>
                            <h3 className="font-semibold text-xl">Copy & Go</h3>
                            <p className="text-gray-600">Once you're happy with the result, just click the "Copy" button and paste it anywhere you need it.</p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
} 