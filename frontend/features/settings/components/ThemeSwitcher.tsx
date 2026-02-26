"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useThemeStore, type Theme } from "@/stores/useThemeStore";
import { Sun, Moon, Monitor } from "lucide-react";

const options: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeSwitcher() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose light, dark theme, or follow your system preference.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <Button
            key={value}
            variant={theme === value ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme(value)}
            className="gap-2"
          >
            <Icon className="size-4" />
            {label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
