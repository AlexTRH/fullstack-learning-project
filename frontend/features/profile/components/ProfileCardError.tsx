"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ProfileCardErrorProps = {
  message: string;
  onSignInAgain: () => void;
};

export function ProfileCardError({ message, onSignInAgain }: ProfileCardErrorProps) {
  return (
    <Card>
      <CardContent className="py-8 text-center">
        <p className="text-muted-foreground text-sm">{message}</p>
        <Button variant="outline" className="mt-4" onClick={onSignInAgain}>
          Sign in again
        </Button>
      </CardContent>
    </Card>
  );
}
