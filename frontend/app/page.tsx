import { HomeCTA } from "./components/HomeCTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">Fullstack Learning Project</h1>
        <p className="text-muted-foreground max-w-content">
          Learning project with Next.js, Express, PostgreSQL, Prisma, TanStack
          Query, Zustand and shadcn/ui
        </p>
        <HomeCTA />
      </main>
    </div>
  );
}
