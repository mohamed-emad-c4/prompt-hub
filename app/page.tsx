import { db } from "@/app/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";

// Configure this route to use the Edge Runtime
export const runtime = 'edge';

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

        <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
              Manage Your Prompts
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-2xl mx-auto">
              Create, manage, and use text prompts with dynamic variables for all your content needs.
            </p>
            <div className="mt-10 flex justify-center">
              <Link href="/admin">
                <div className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200">
                  Get Started
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Prompts</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select any prompt to customize it with your own variables.
          </p>
        </div>

        {prompts.length === 0 ? (
          <div className="text-center py-16 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-glass">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No prompts available yet</h3>
            <p className="mt-2 text-sm text-gray-500">Check back later for new content or create your own in the admin panel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prompts.map((prompt, index) => (
              <Link key={prompt.id} href={`/prompt/${prompt.id}`} className="group">
                <Card
                  glass={index % 3 === 0}
                  className="h-full hover:shadow-hover transition-all duration-300 group-hover:border-primary-200 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary-700 transition-colors">{prompt.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-gray-600">
                      {prompt.content.substring(0, 150)}
                      {prompt.content.length > 150 ? "..." : ""}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                      <span>Customize prompt</span>
                      <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="relative bg-gray-50 py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-accent-100 blur-3xl opacity-50"></div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage and use dynamic text prompts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card glass className="backdrop-blur-sm">
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

            <Card glass className="backdrop-blur-sm">
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

            <Card glass className="backdrop-blur-sm">
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
      </div>
    </>
  );
}
