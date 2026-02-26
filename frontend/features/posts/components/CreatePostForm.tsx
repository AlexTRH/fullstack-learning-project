"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CreatePostInput } from "../api";

const textareaClasses =
  "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y";

type CreatePostFormProps = {
  onSubmit: (data: CreatePostInput) => Promise<unknown>;
  onSuccess?: () => void;
  className?: string;
};

export function CreatePostForm({
  onSubmit,
  onSuccess,
  className,
}: CreatePostFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Content is required");
      return;
    }
    if (trimmed.length > 10000) {
      setError("Content is too long");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ content: trimmed });
      setContent("");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">New post</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Field>
            <FieldLabel htmlFor="post-content">Content</FieldLabel>
            <FieldContent>
              <textarea
                id="post-content"
                className={textareaClasses}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={10001}
                rows={4}
                disabled={isSubmitting}
              />
              <div className="flex items-center justify-between gap-2">
                <FieldError>{error ?? null}</FieldError>
                <span className="text-muted-foreground text-xs">
                  {content.length}/10000
                </span>
              </div>
            </FieldContent>
          </Field>
          <Button type="submit" className="mt-3" disabled={isSubmitting}>
            {isSubmitting ? "Posting…" : "Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
