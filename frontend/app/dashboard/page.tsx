"use client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "../features/auth/useAuth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const { signOut } = useAuth();
  const router = useRouter();

  const onLogoutClick = async () => {
    const result = await signOut();

    if (result.ok) {
      router.push("/login");
    }
  };

  return (
    <div>
      <h2>Registered successfully</h2>
      <p>user id: {user?.id}</p>
      <p>user name: {user?.name}</p>
      <p>user email: {user?.email}</p>
      <p className="break-all">user access token: {token}</p>
      <button
        className="bg-primary cursor-pointer rounded-xl px-10 py-5 text-white"
        onClick={onLogoutClick}
      >
        Logout
      </button>
    </div>
  );
}
