"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import type { UserPublicResponse } from "../api";
import { toggleFollow } from "../api";
import { getInitials } from "../utils";

type UserListItemProps = {
  user: UserPublicResponse;
  /** ID of the profile page we're on (to invalidate followers/following lists after toggle) */
  profileUserId?: string;
  /** When true (e.g. in "Following" list on own profile), show Unfollow without asking API */
  initialIsFollowing?: boolean;
};

export function UserListItem({ user, profileUserId, initialIsFollowing }: UserListItemProps) {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(
    initialIsFollowing !== undefined ? initialIsFollowing : null
  );

  const followMutation = useMutation({
    mutationFn: () => toggleFollow(user.id),
    onSuccess: (data) => {
      setIsFollowing(data.isFollowing);
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (currentUserId) {
        queryClient.invalidateQueries({ queryKey: ["user", currentUserId] });
      }
      if (profileUserId) {
        queryClient.invalidateQueries({ queryKey: ["user", profileUserId, "followers"] });
        queryClient.invalidateQueries({ queryKey: ["user", profileUserId, "following"] });
      }
    },
  });

  const displayName = user.name?.trim() || user.username;
  const initials = getInitials(user.name, user.username);
  const isOwnProfile = currentUserId === user.id;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Link
          href={`/users/${user.id}`}
          className="flex min-w-0 flex-1 items-center gap-4 no-underline hover:opacity-90"
        >
          <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-muted bg-muted text-sm font-semibold text-muted-foreground">
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
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{displayName}</p>
            <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </Link>
        {!isOwnProfile && isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={() => followMutation.mutate()}
            disabled={followMutation.isPending}
          >
            {followMutation.isPending
              ? "..."
              : (isFollowing ?? initialIsFollowing) === true
                ? "Unfollow"
                : "Follow"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
