"use client";

import { useAuth } from "@/features/auth/useAuth";
import { fetchMe } from "@/features/profile/api";
import { ProfileCard } from "@/features/profile/components/ProfileCard";
import { ProfileCardError } from "@/features/profile/components/ProfileCardError";
import { ProfileCardLoading } from "@/features/profile/components/ProfileCardLoading";
import { useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DASHBOARD_LAYOUT_CLASS =
  "flex min-h-svh w-full items-center justify-center p-page md:p-page-md";

export default function Dashboard() {
  const router = useRouter();
  const { signOut } = useAuth();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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

  const onLogout = async () => {
    const result = await signOut();
    if (result.ok) router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className={DASHBOARD_LAYOUT_CLASS}>
      <div className="max-w-content w-full">
        {isLoading && <ProfileCardLoading />}
        {isError && (
          <ProfileCardError
            message={
              error instanceof Error ? error.message : "Failed to load profile"
            }
            onSignInAgain={() => router.push("/login")}
          />
        )}
        {profile && <ProfileCard profile={profile} onLogout={onLogout} />}
      </div>
    </div>
  );
}
