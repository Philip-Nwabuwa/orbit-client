import LoginFlow from "@/components/auth/LoginFlow";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100dvh-0px)] grid place-items-center px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Collabix
          </h1>
          <p className="text-sm text-muted-foreground">
            Lazy email sign-in with code or password. Create or join a
            workspace.
          </p>
        </div>
        <LoginFlow />
      </div>
    </main>
  );
}
