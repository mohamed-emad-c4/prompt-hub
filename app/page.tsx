import { db } from "@/app/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PromptHub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our collection of prompt templates. Click on any prompt to customize it with your own variables.
        </p>
      </div>

      {prompts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-600">No prompts available yet.</h2>
          <p className="mt-2 text-gray-500">Check back later for new content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompt/${prompt.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{prompt.title}</CardTitle>
                  <CardDescription>
                    Last updated: {new Date(prompt.updatedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-gray-600">
                    {prompt.content.substring(0, 150)}
                    {prompt.content.length > 150 ? "..." : ""}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
