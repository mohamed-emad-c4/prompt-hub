import { db } from "@/app/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Section } from "@/app/components/layout/section";
import { EditIcon } from "@/app/icons/edit-icon";
import { EyeIcon } from "@/app/icons/eye-icon";
import { CopyIcon } from "@/app/icons/copy-icon";

// Use Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

async function getPublishedPrompts() {
  try {
    const prompts = await db.prompt.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return prompts;
  } catch (error) {
    console.error("Failed to fetch prompts:", error);
    return [];
  }
}

export default async function Home() {
  const prompts = await getPublishedPrompts();

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0">
          <svg
            className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 md:-translate-y-1/2 lg:translate-x-0"
            width="404"
            height="784"
            fill="none"
            viewBox="0 0 404 784"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="5d0dd344-b041-4d26-bec4-8d33ea57ec9b"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" className="text-primary-500/30" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="784" fill="url(#5d0dd344-b041-4d26-bec4-8d33ea57ec9b)" />
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary-400/20 blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-secondary-400/20 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <Section>
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl tracking-tight">
              Unleash Your Creativity with <span className="bg-clip-text text-black bg-gradient-to-r from-primary-400 to-accent-400">PromptHub</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto">
              The ultimate solution for crafting, managing, and deploying powerful AI prompts. Turn your ideas into perfectly structured commands, instantly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/prompts">
                  Explore Prompts
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-black hover:bg-white/10 hover:text-white backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </Section>
      </div>

      {/* Features Section */}
      <Section id="features" className="bg-gray-50 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent-100 blur-3xl opacity-50"></div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage and use dynamic text prompts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-glass">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Dynamic Variables</h3>
                <p className="text-gray-600">
                  Create templates with &#123;&#123;variable&#125;&#125; syntax that users can customize for their specific needs.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Live Preview</h3>
                <p className="text-gray-600">
                  See your changes in real-time as you fill in the variables in your prompt templates.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Copy to Clipboard</h3>
                <p className="text-gray-600">
                  Easily copy the final prompt with a single click for use in your favorite applications.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
