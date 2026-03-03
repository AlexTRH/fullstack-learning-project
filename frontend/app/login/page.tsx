import { LoginForm } from "@/features/auth/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-page md:p-page-md">
      <div className="w-full max-w-content-narrow">
        <LoginForm />
      </div>
    </div>
  );
}
