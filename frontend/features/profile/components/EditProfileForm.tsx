"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile, type GetMeResponse, type UpdateProfileInput } from "../api";
import { updateProfileSchema, type UpdateProfileFormData } from "../schema";

type EditProfileFormProps = {
  profile: GetMeResponse;
};

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (body: UpdateProfileInput) => updateProfile(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name ?? "",
      bio: profile.bio ?? "",
      avatar: profile.avatar ?? "",
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileFormData> = (data) => {
    const body: UpdateProfileInput = {};
    if (data.name?.trim()) body.name = data.name.trim();
    if (data.bio !== undefined) body.bio = data.bio.trim() || undefined;
    if (data.avatar?.trim()) body.avatar = data.avatar.trim();
    mutation.mutate(body);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit profile</CardTitle>
        <CardDescription>
          Update your name, bio, and avatar URL
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="Your name"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Input
                {...register("bio")}
                id="bio"
                type="text"
                placeholder="Short bio"
              />
              {errors.bio && (
                <p className="text-xs text-red-500">{errors.bio.message}</p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="avatar">Avatar URL</FieldLabel>
              <Input
                {...register("avatar")}
                id="avatar"
                type="url"
                placeholder="https://..."
              />
              {errors.avatar && (
                <p className="text-xs text-red-500">{errors.avatar.message}</p>
              )}
            </Field>
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || mutation.isPending}
              >
                {mutation.isPending || isSubmitting
                  ? "Saving..."
                  : "Save changes"}
              </Button>
              {mutation.isSuccess && (
                <p className="text-center text-sm text-green-600">
                  Profile updated
                </p>
              )}
              {mutation.isError && (
                <p className="text-center text-sm text-red-500">
                  {mutation.error instanceof Error
                    ? mutation.error.message
                    : "Failed to update"}
                </p>
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
