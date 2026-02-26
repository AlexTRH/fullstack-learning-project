"use client";

import { use } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchPostById,
  deletePost,
} from "@/features/posts/api";
import { PostDetailCard } from "@/features/posts/components/PostDetailCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default function PostDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/posts");
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col p-page md:p-page-md">
      <div className="mx-auto w-full max-w-content space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/posts">← Feed</Link>
          </Button>
        </div>

        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">Loading…</p>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : "Failed to load post"}
              </p>
              <Button variant="outline" className="mt-2" asChild>
                <Link href="/posts">Back to feed</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {post && (
          <PostDetailCard
            post={post}
            onDelete={(postId) => deleteMutation.mutate(postId)}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}
