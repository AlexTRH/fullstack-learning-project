"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SignUpFormUserData } from "@/features/auth/types";
import { schema } from "@/features/auth/types";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormUserData>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const { signUp } = useAuth();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignUpFormUserData> = async (data) => {
    const result = await signUp(data);

    if (result.ok) {
      router.push("/dashboard");
      setError(null);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  {...register("fullname")}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
                {errors.fullname && (
                  <p className="text-xs text-red-500">
                    {errors.fullname?.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  {...register("username")}
                  id="username"
                  type="text"
                  placeholder="john123"
                  required
                />
                {errors.username && (
                  <p className="text-xs text-red-500">
                    {errors.username?.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-500">
                    {errors.email?.message}
                  </p>
                )}
              </Field>
              <Field>
                <FieldGroup className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...register("confirmPassword")}
                      id="confirm-password"
                      type="password"
                      required
                    />
                  </Field>
                </FieldGroup>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword?.message}
                  </p>
                )}
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password?.message}
                  </p>
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="bg-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Loading..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link href="/login" className="underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
    </div>
  );
}
