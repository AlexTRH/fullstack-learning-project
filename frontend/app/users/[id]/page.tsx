"use client";

import { use, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUserById, fetchFollowers, fetchFollowing } from "@/features/profile/api";
import { UserProfileCard } from "@/features/profile/components/UserProfileCard";
import { UserListItem } from "@/features/profile/components/UserListItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/useAuthStore";

const PAGE_LAYOUT_CLASS =
  "flex min-h-svh w-full items-center justify-center p-page md:p-page-md";

type OpenList = "followers" | "following" | null;

type PageProps = { params: Promise<{ id: string }> };

export default function UserProfilePage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const [openList, setOpenList] = useState<OpenList>(null);

  useEffect(() => {
    if (currentUserId && id === currentUserId) {
      router.replace("/dashboard");
    }
  }, [currentUserId, id, router]);

  const isOwnProfile = currentUserId !== null && id === currentUserId;

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    retry: false,
    enabled: !isOwnProfile,
  });

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["user", id, "followers"],
    queryFn: () => fetchFollowers(id),
    enabled: !!user && openList === "followers",
  });

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["user", id, "following"],
    queryFn: () => fetchFollowing(id),
    enabled: !!user && openList === "following",
  });

  if (isOwnProfile) return null;

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

  const list = openList === "followers" ? followers : following;
  const isLoadingList =
    openList === "followers" ? isLoadingFollowers : isLoadingFollowing;

  const toggleFollowers = () =>
    setOpenList((prev) => (prev === "followers" ? null : "followers"));
  const toggleFollowing = () =>
    setOpenList((prev) => (prev === "following" ? null : "following"));

  return (
    <div className={PAGE_LAYOUT_CLASS}>
      <div className="w-full max-w-content space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/">← Home</Link>
        </Button>
        <UserProfileCard
          user={user}
          onFollowersClick={toggleFollowers}
          onFollowingClick={toggleFollowing}
        />
        {openList !== null && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              {openList === "followers"
                ? `Followers (${user._count.followers})`
                : `Following (${user._count.following})`}
            </p>
            {isLoadingList ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground text-sm">Loading...</p>
                </CardContent>
              </Card>
            ) : list.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    {openList === "followers"
                      ? "No followers"
                      : "Not following anyone"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-2">
                {list.map((u) => (
                  <li key={u.id}>
                    <UserListItem
                      user={u}
                      profileUserId={id}
                      initialIsFollowing={
                        openList === "following" && id === currentUserId
                          ? true
                          : undefined
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
