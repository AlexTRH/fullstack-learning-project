import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Fullstack Learning Project</h1>
        <p className="text-muted-foreground max-w-md">
          Учебный проект с Next.js, Express, PostgreSQL, Prisma, TanStack Query,
          Zustand и shadcn/ui
        </p>
        <div className="flex gap-4">
          <Link
            href="/example-isr"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            ISR Example
          </Link>
        </div>
      </main>
    </div>
  );
}
