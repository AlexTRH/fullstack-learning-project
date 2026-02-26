"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PostWithAuthor } from "../api";
import { formatPostDate } from "../utils";
import { getInitials } from "@/features/profile/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Pencil, Trash2 } from "lucide-react";

type PostCardProps = {
  post: PostWithAuthor;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

export function PostCard({ post, onDelete, isDeleting }: PostCardProps) {
  const userId = useAuthStore((s) => s.user?.id);
  const isAuthor = userId === post.authorId;
  const displayName = post.author.name?.trim() || post.author.username;
  const initials = getInitials(post.author.name, post.author.username);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Link
          href={`/users/${post.author.id}`}
          className="flex items-center gap-3 rounded-md hover:bg-muted/50 transition-colors -m-2 p-2"
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted text-sm font-medium text-muted-foreground">
            {post.author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.author.avatar}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{displayName}</p>
            <p className="text-sm text-muted-foreground truncate">
              @{post.author.username}
            </p>
          </div>
        </Link>
        <time
          dateTime={post.createdAt}
          className="ml-auto text-sm text-muted-foreground shrink-0"
        >
          {formatPostDate(post.createdAt)}
        </time>
      </CardHeader>
      <CardContent className="pt-0">
        <Link href={`/posts/${post.id}`} className="block hover:opacity-90">
          <p className="whitespace-pre-wrap break-words">{post.content}</p>
        </Link>
        {post.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {post.attachments.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary underline"
              >
                Attachment
              </a>
            ))}
          </div>
        )}
      </CardContent>
      {isAuthor && (
        <CardFooter className="flex gap-2 pt-0">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/posts/${post.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
          {typeof onDelete === "function" && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(post.id)}
              disabled={isDeleting}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
