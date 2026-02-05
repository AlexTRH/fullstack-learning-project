"use client";

import Link from "next/link";
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
import type { GetMeResponse } from "../api";
import { getInitials } from "../utils";

type ProfileCardProps = {
  profile: GetMeResponse;
  onLogout: () => void;
};

export function ProfileCard({ profile, onLogout }: ProfileCardProps) {
  const displayName = profile.name?.trim() || profile.username;
  const initials = getInitials(profile.name, profile.username);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-20 items-center justify-center overflow-hidden rounded-full border-2 border-muted bg-muted text-2xl font-semibold text-muted-foreground">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={displayName}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <CardTitle className="text-2xl">{displayName}</CardTitle>
        <CardDescription>@{profile.username}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <p className="text-muted-foreground">Email</p>
          <p className="font-medium">{profile.email}</p>
        </div>
        {profile.bio?.trim() && (
          <div className="text-sm">
            <p className="text-muted-foreground">Bio</p>
            <p className="font-medium">{profile.bio}</p>
          </div>
        )}
        <Separator />
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold">{profile._count.posts}</p>
            <p className="text-xs text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {profile._count.followers}
            </p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">
              {profile._count.following}
            </p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-center gap-2 border-t pt-6">
        <Button variant="outline" asChild>
          <Link href={`/users/${profile.id}`}>Public profile</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/settings">Edit profile</Link>
        </Button>
        <Button variant="outline" onClick={onLogout}>
          Logout
        </Button>
      </CardFooter>
    </Card>
  );
}
