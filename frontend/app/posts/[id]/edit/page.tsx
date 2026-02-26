"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchPostById,
  updatePost,
} from "@/features/posts/api";
import { EditPostForm } from "@/features/posts/components/EditPostForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = { params: Promise<{ id: string }> };

export default function EditPostPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  const { data: post, isLoading, isError, error } = useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: () => fetchPostById(id),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (body: { content?: string }) => updatePost(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/posts/${id}`);
    },
  });

  const isAuthor = userId === post?.authorId;

  return (
    <div className="flex min-h-0 flex-1 flex-col p-page md:p-page-md">
      <div className="mx-auto w-full max-w-content space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/posts/${id}`}>← Post</Link>
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

        {post && !isAuthor && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                You can only edit your own posts.
              </p>
              <Button variant="outline" className="mt-2" asChild>
                <Link href={`/posts/${id}`}>View post</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {post && isAuthor && (
          <Card>
            <CardContent className="pt-6">
              <h1 className="text-lg font-semibold mb-4">Edit post</h1>
              <EditPostForm
                initialContent={post.content}
                onSubmit={(body) => updateMutation.mutateAsync(body)}
                onCancel={() => router.push(`/posts/${id}`)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
