"use client";

import { Card, CardContent } from "@/components/ui/card";

export function ProfileCardLoading() {
  return (
    <Card>
      <CardContent className="flex items-center justify-center py-12">
        <p className="text-muted-foreground text-sm">Loading profile...</p>
      </CardContent>
    </Card>
  );
}
