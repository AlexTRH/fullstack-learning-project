"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { fetchMe } from "@/features/profile/api";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";
import { ProfileCardLoading } from "@/features/profile/components/ProfileCardLoading";
import { ProfileCardError } from "@/features/profile/components/ProfileCardError";
import { ThemeSwitcher } from "@/features/settings/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";

const PAGE_LAYOUT_CLASS =
  "flex min-h-svh w-full items-center justify-center p-page md:p-page-md";

export default function DashboardSettingsPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: profile, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className={PAGE_LAYOUT_CLASS}>
      <div className="w-full max-w-content space-y-6">
        <Button variant="ghost" asChild>
          <Link href="/dashboard">← Back to profile</Link>
        </Button>
        {isLoading && <ProfileCardLoading />}
        {isError && (
          <ProfileCardError
            message={
              error instanceof Error ? error.message : "Failed to load profile"
            }
            onSignInAgain={() => router.push("/login")}
          />
        )}
        <ThemeSwitcher />
        {profile && <EditProfileForm profile={profile} />}
      </div>
    </div>
  );
}
