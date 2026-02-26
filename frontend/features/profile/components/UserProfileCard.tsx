"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserPublicResponse } from "../api";
import { toggleFollow } from "../api";
import { getInitials } from "../utils";

type UserProfileCardProps = {
  user: UserPublicResponse;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
};

export function UserProfileCard({ user, onFollowersClick, onFollowingClick }: UserProfileCardProps) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  const followMutation = useMutation({
    mutationFn: () => toggleFollow(user.id),
    onSuccess: (data) => {
      setIsFollowing(data.isFollowing);
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      // Refresh current user's profile (dashboard "following" count)
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ["user", currentUserId] });
      }
    },
  });

  const displayName = user.name?.trim() || user.username;
  const initials = getInitials(user.name, user.username);
  const isOwnProfile = currentUserId === user.id;

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-muted bg-muted text-2xl font-semibold text-muted-foreground">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={displayName}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <CardTitle className="text-2xl">{displayName}</CardTitle>
        <CardDescription>@{user.username}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio?.trim() && (
          <div className="text-sm">
            <p className="text-muted-foreground">Bio</p>
            <p className="font-medium">{user.bio}</p>
          </div>
        )}
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{user._count.posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div
            role={onFollowersClick ? "button" : undefined}
            tabIndex={onFollowersClick ? 0 : undefined}
            onClick={onFollowersClick}
            onKeyDown={
              onFollowersClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onFollowersClick();
                    }
                  }
                : undefined
            }
            className={
              onFollowersClick
                ? "cursor-pointer rounded-md transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
                : undefined
            }
          >
            <p className="text-2xl font-semibold">{user._count.followers}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div
            role={onFollowingClick ? "button" : undefined}
            tabIndex={onFollowingClick ? 0 : undefined}
            onClick={onFollowingClick}
            onKeyDown={
              onFollowingClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onFollowingClick();
                    }
                  }
                : undefined
            }
            className={
              onFollowingClick
                ? "cursor-pointer rounded-md transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
                : undefined
            }
          >
            <p className="text-2xl font-semibold">{user._count.following}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 border-t pt-6">
        {isOwnProfile ? (
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings">Edit profile</Link>
          </Button>
        ) : !isAuthenticated ? (
          <Button variant="outline" asChild>
            <Link href="/login">Sign in to follow</Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
          >
            {followMutation.isPending
              ? "..."
              : isFollowing === true
                ? "Unfollow"
                : "Follow"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
