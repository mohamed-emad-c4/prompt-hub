// Configure this route to use the Edge Runtime
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default function PromptLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
} 