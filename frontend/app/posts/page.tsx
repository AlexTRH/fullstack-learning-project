"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPosts,
  createPost,
  deletePost,
} from "@/features/posts/api";
import { PostCard } from "@/features/posts/components/PostCard";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";

const PAGE_SIZE = 20;

export default function PostsFeedPage() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "list", page],
    queryFn: () => fetchPosts({ page, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col p-page md:p-page-md">
      <div className="mx-auto w-full max-w-content space-y-6">
        <h1 className="text-2xl font-semibold">Feed</h1>

        {isAuthenticated && (
          <CreatePostForm
            onSubmit={(body) => createMutation.mutateAsync(body)}
            onSuccess={() => createMutation.reset()}
          />
        )}

        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">Loading posts…</p>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : "Failed to load feed"}
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            {data.posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground text-sm">
                    No posts yet. Be the first to post!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-4">
                {data.posts.map((post) => (
                  <li key={post.id}>
                    <PostCard
                      post={post}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      isDeleting={deleteMutation.isPending}
                    />
                  </li>
                ))}
              </ul>
            )}

            {(data.total > PAGE_SIZE || page > 1) && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(data.total / PAGE_SIZE) || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / PAGE_SIZE)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
