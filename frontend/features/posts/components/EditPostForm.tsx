"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { UpdatePostInput } from "../api";

const textareaClasses =
  "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-y";

type EditPostFormProps = {
  initialContent: string;
  onSubmit: (data: UpdatePostInput) => Promise<unknown>;
  onCancel?: () => void;
  className?: string;
};

export function EditPostForm({
  initialContent,
  onSubmit,
  onCancel,
  className,
}: EditPostFormProps) {
  const [content, setContent] = useState(initialContent);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError("Content cannot be empty");
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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update post"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn(className)}>
      <Field>
        <FieldLabel htmlFor="edit-post-content">Content</FieldLabel>
        <FieldContent>
          <textarea
            id="edit-post-content"
            className={textareaClasses}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={10001}
            rows={6}
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
      <div className="flex gap-2 mt-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
