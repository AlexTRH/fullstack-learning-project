"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchUserById } from "@/features/profile/api";
import { UserProfileCard } from "@/features/profile/components/UserProfileCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PAGE_LAYOUT_CLASS =
  "flex min-h-svh w-full items-center justify-center p-page md:p-page-md";

type PageProps = { params: Promise<{ id: string }> };

export default function UserProfilePage({ params }: PageProps) {
  const { id } = use(params);

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className={PAGE_LAYOUT_CLASS}>
        <div className="w-full max-w-content">
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    const is404 =
      error &&
      typeof error === "object" &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404;
    return (
      <div className={PAGE_LAYOUT_CLASS}>
        <div className="w-full max-w-content space-y-4 text-center">
          <Card>
            <CardContent className="py-8">
              <p className="text-muted-foreground text-sm">
                {is404 ? "User not found" : "Failed to load profile"}
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/">Go home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE_LAYOUT_CLASS}>
      <div className="w-full max-w-content space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Home</Link>
        </Button>
        <UserProfileCard user={user} />
      </div>
    </div>
  );
}
