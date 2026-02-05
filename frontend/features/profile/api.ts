import api from "@/lib/api";

export type GetMeResponse = {
  id: string;
  email: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { posts: number; followers: number; following: number };
};

export async function fetchMe(): Promise<GetMeResponse> {
  const { data } = await api.get<{ success: boolean; data: GetMeResponse }>(
    "/api/users/me"
  );
  return data.data;
}

export type UpdateProfileInput = {
  name?: string;
  bio?: string;
  avatar?: string;
};

export async function updateProfile(
  body: UpdateProfileInput
): Promise<GetMeResponse> {
  const { data } = await api.put<{ success: boolean; data: GetMeResponse }>(
    "/api/users/me",
    body
  );
  return data.data;
}

export type UserPublicResponse = {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: string;
  _count: { posts: number; followers: number; following: number };
};

export async function fetchUserById(id: string): Promise<UserPublicResponse> {
  const { data } = await api.get<{
    success: boolean;
    data: UserPublicResponse;
  }>(`/api/users/${id}`);
  return data.data;
}

export async function toggleFollow(userId: string): Promise<{ isFollowing: boolean }> {
  const { data } = await api.post<{
    success: boolean;
    data: { isFollowing: boolean };
  }>(`/api/users/${userId}/follow`);
  return data.data;
}

export async function fetchFollowers(userId: string): Promise<UserPublicResponse[]> {
  const { data } = await api.get<{
    success: boolean;
    data: UserPublicResponse[];
  }>(`/api/users/${userId}/followers`);
  return data.data;
}

export async function fetchFollowing(userId: string): Promise<UserPublicResponse[]> {
  const { data } = await api.get<{
    success: boolean;
    data: UserPublicResponse[];
  }>(`/api/users/${userId}/following`);
  return data.data;
}
