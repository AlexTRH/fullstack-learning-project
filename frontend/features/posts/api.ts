import api from "@/lib/api";

/** Author shape in post responses (matches backend UserPublicData + _count) */
export type PostAuthor = {
  id: string;
  username: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  isVerified: boolean;
  createdAt: string;
  _count: { posts: number; followers: number; following: number };
};

/** Post as returned by create/update (no author) */
export type Post = {
  id: string;
  content: string;
  authorId: string;
  attachments: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PostWithAuthor = Post & {
  author: PostAuthor;
};

export type ListPostsParams = {
  page?: number;
  limit?: number;
  authorId?: string;
};

export type ListPostsResponse = {
  posts: PostWithAuthor[];
  total: number;
  page: number;
  limit: number;
};

export async function fetchPosts(
  params: ListPostsParams = {}
): Promise<ListPostsResponse> {
  const { page = 1, limit = 20, authorId } = params;
  const sp = new URLSearchParams();
  sp.set("page", String(page));
  sp.set("limit", String(limit));
  if (authorId) sp.set("authorId", authorId);
  const { data } = await api.get<{ success: boolean; data: ListPostsResponse }>(
    `/api/posts?${sp.toString()}`
  );
  return data.data;
}

export async function fetchPostById(id: string): Promise<PostWithAuthor> {
  const { data } = await api.get<{
    success: boolean;
    data: PostWithAuthor;
  }>(`/api/posts/${id}`);
  return data.data;
}

export type CreatePostInput = {
  content: string;
  attachments?: string[];
};

export async function createPost(body: CreatePostInput): Promise<Post> {
  const { data } = await api.post<{ success: boolean; data: Post }>(
    "/api/posts",
    body
  );
  return data.data;
}

export type UpdatePostInput = {
  content?: string;
  attachments?: string[];
};

export async function updatePost(
  id: string,
  body: UpdatePostInput
): Promise<Post> {
  const { data } = await api.patch<{ success: boolean; data: Post }>(
    `/api/posts/${id}`,
    body
  );
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/api/posts/${id}`);
}
