"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "@/features/profile/api";
import { UserListItem } from "@/features/profile/components/UserListItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 20;

export default function PeoplePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", "list", page, search],
    queryFn: () => fetchUsers({ page, limit: PAGE_SIZE, search: search || undefined }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col p-page md:p-page-md">
      <div className="mx-auto w-full max-w-content space-y-6">
        <h1 className="text-2xl font-semibold">People</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search by username or name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="secondary">
            Search
          </Button>
        </form>

        {isLoading && (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <p className="text-muted-foreground text-sm">Loading...</p>
            </CardContent>
          </Card>
        )}

        {isError && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : "Failed to load people"}
              </p>
            </CardContent>
          </Card>
        )}

        {data && (
          <>
            <p className="text-sm text-muted-foreground">
              {data.total} {data.total === 1 ? "user" : "users"} found
            </p>
            {data.users.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No users found. Try a different search.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-2">
                {data.users.map((user) => (
                  <li key={user.id}>
                    <UserListItem user={user} />
                  </li>
                ))}
              </ul>
            )}

            {(data.total > PAGE_SIZE || page > 1) && (
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {Math.ceil(data.total / PAGE_SIZE) || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(data.total / PAGE_SIZE)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
