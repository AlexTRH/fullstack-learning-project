"use client";

import { useState } from "react";
import { useAuth } from "@/features/auth/useAuth";
import { fetchMe, fetchFollowers, fetchFollowing } from "@/features/profile/api";
import { ProfileCard } from "@/features/profile/components/ProfileCard";
import { ProfileCardError } from "@/features/profile/components/ProfileCardError";
import { ProfileCardLoading } from "@/features/profile/components/ProfileCardLoading";
import { UserListItem } from "@/features/profile/components/UserListItem";
import { fetchPosts, deletePost } from "@/features/posts/api";
import { PostCard } from "@/features/posts/components/PostCard";
import { PostCardSkeleton } from "@/features/posts/components/PostCardSkeleton";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DASHBOARD_LAYOUT_CLASS =
  "flex min-h-svh w-full items-center justify-center p-page md:p-page-md";

type OpenList = "followers" | "following" | null;

const MY_POSTS_PAGE_SIZE = 10;

export default function Dashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { signOut } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const [openList, setOpenList] = useState<OpenList>(null);
  const [postsPage, setPostsPage] = useState(1);

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: followers = [], isLoading: isLoadingFollowers } = useQuery({
    queryKey: ["user", profile?.id, "followers"],
    queryFn: () => fetchFollowers(profile!.id),
    enabled: !!profile && openList === "followers",
  });

  const { data: following = [], isLoading: isLoadingFollowing } = useQuery({
    queryKey: ["user", profile?.id, "following"],
    queryFn: () => fetchFollowing(profile!.id),
    enabled: !!profile && openList === "following",
  });

  const { data: myPostsData } = useQuery({
    queryKey: ["posts", "list", "me", postsPage],
    queryFn: () =>
      fetchPosts({ page: postsPage, limit: MY_POSTS_PAGE_SIZE, authorId: profile!.id }),
    enabled: !!profile?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const onLogout = async () => {
    const result = await signOut();
    if (result.ok) router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const list = openList === "followers" ? followers : following;
  const isLoadingList =
    openList === "followers" ? isLoadingFollowers : isLoadingFollowing;

  return (
    <div className={DASHBOARD_LAYOUT_CLASS}>
      <div className="max-w-content w-full space-y-6">
        {isLoading && <ProfileCardLoading />}
        {isError && (
          <ProfileCardError
            message={
              error instanceof Error ? error.message : "Failed to load profile"
            }
            onSignInAgain={() => router.push("/login")}
          />
        )}
        {profile && (
          <>
            <ProfileCard
              profile={profile}
              onLogout={onLogout}
              onFollowersClick={() =>
                setOpenList((prev) => (prev === "followers" ? null : "followers"))
              }
              onFollowingClick={() =>
                setOpenList((prev) => (prev === "following" ? null : "following"))
              }
            />

            {openList !== null && (
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    {openList === "followers"
                      ? `Followers (${profile._count.followers})`
                      : `Following (${profile._count.following})`}
                  </p>
                  {isLoadingList ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : list.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {openList === "followers"
                        ? "No followers"
                        : "Not following anyone"}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {list.map((u) => (
                        <li key={u.id}>
                          <UserListItem
                            user={u}
                            profileUserId={profile.id}
                            initialIsFollowing={
                              openList === "following" ? true : undefined
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">My posts</h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/posts">All posts →</Link>
                  </Button>
                </div>
                {!myPostsData ? (
                  <ul className="space-y-4">
                    {[1, 2].map((i) => (
                      <li key={i}>
                        <PostCardSkeleton />
                      </li>
                    ))}
                  </ul>
                ) : myPostsData.posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No posts yet. Create one in the Feed.
                  </p>
                ) : (
                  <ul className="space-y-4">
                    {myPostsData.posts.map((post) => (
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
                {myPostsData &&
                  myPostsData.total > MY_POSTS_PAGE_SIZE &&
                  postsPage * MY_POSTS_PAGE_SIZE < myPostsData.total && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPostsPage((p) => p + 1)}
                    >
                      Load more
                    </Button>
                  )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
