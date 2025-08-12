"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  ShieldCheck,
  Lock,
  ArrowRight,
  Check,
  Plus,
  Building2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { socketClient } from "@/lib/socket";
import { cn } from "@/lib/utils";

type Step =
  | "email"
  | "verify"
  | "password"
  | "choose"
  | "survey"
  | "build"
  | "done";

type WorkspaceSummary = {
  id: string;
  name: string;
};

type StartLoginResponse = {
  pendingToken: string;
  // whether code was sent
  sentCode: boolean;
};

type VerifyCodeResponse = {
  sessionToken: string;
  userId: string;
  workspaces: WorkspaceSummary[];
};

type PasswordLoginResponse = VerifyCodeResponse;

type CreateWorkspaceResponse = {
  workspaceId: string;
};

export default function LoginFlow() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]); // 6-digit
  const [password, setPassword] = useState("");
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[] | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );
  const [creatingNew, setCreatingNew] = useState<boolean>(false);
  const [survey, setSurvey] = useState({
    teamName: "",
    teamSize: "1-5",
    role: "",
    useCase: "Communication",
  });
  const [buildProgress, setBuildProgress] = useState<number>(0);
  const [buildMessage, setBuildMessage] = useState<string>("Initializing...");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Autofocus handling
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "email") emailRef.current?.focus();
    if (step === "password") passwordRef.current?.focus();
    if (step === "verify") codeRefs.current[0]?.focus();
  }, [step]);

  // Persist temporary session token for subsequent requests
  useEffect(() => {
    if (sessionToken) {
      try {
        window.localStorage.setItem("sessionToken", sessionToken);
      } catch {}
    }
  }, [sessionToken]);

  const codeValue = useMemo(() => code.join(""), [code]);

  // Socket progress listener during build
  useEffect(() => {
    if (step !== "build") return;

    const socket = socketClient.connect();
    const onProgress = (payload: { progress: number; message?: string }) => {
      setBuildProgress(Math.max(0, Math.min(100, payload.progress)));
      if (payload.message) setBuildMessage(payload.message);
    };
    socketClient.on("workspace:buildProgress", onProgress);

    // Fallback simulated progress if backend does not emit
    let fallbackTimer: NodeJS.Timeout | null = null;
    if (buildProgress === 0) {
      fallbackTimer = setInterval(() => {
        setBuildProgress((p) => {
          const next = Math.min(98, p + Math.random() * 8);
          if (next > 50)
            setBuildMessage("Creating channels, roles and defaults...");
          if (next > 80)
            setBuildMessage("Wiring real-time presence and history...");
          return next;
        });
      }, 800);
    }

    return () => {
      socketClient.off("workspace:buildProgress", onProgress);
      if (fallbackTimer) clearInterval(fallbackTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  async function handleStartLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // Try real API first; fall back to mock if unavailable
      const res = await (async () => {
        try {
          return await apiClient.post<StartLoginResponse>("/auth/login/start", {
            email,
          });
        } catch {
          await new Promise((r) => setTimeout(r, 400));
          return {
            pendingToken: "mock-pending-token",
            sentCode: true,
          } as StartLoginResponse;
        }
      })();
      setPendingToken(res.pendingToken);
      setStep("verify");
    } catch (err: any) {
      setError(err?.message ?? "Failed to start login");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await (async () => {
        try {
          return await apiClient.post<VerifyCodeResponse>(
            "/auth/login/verify",
            {
              email,
              code: codeValue,
              pendingToken,
            }
          );
        } catch {
          await new Promise((r) => setTimeout(r, 400));
          return {
            sessionToken: "mock-session-token",
            userId: "mock-user-id",
            workspaces: [
              { id: "demo-1", name: "Collabix Demo" },
              { id: "team-xyz", name: "Team XYZ" },
            ],
          } as VerifyCodeResponse;
        }
      })();
      setSessionToken(res.sessionToken);
      setWorkspaces(res.workspaces);
      setStep("choose");
    } catch (err: any) {
      setError(err?.message ?? "Invalid or expired code");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await (async () => {
        try {
          return await apiClient.post<PasswordLoginResponse>(
            "/auth/login/password",
            {
              email,
              password,
              pendingToken,
            }
          );
        } catch {
          await new Promise((r) => setTimeout(r, 350));
          return {
            sessionToken: "mock-session-token",
            userId: "mock-user-id",
            workspaces: [
              { id: "demo-1", name: "Collabix Demo" },
              { id: "team-xyz", name: "Team XYZ" },
            ],
          } as PasswordLoginResponse;
        }
      })();
      setSessionToken(res.sessionToken);
      setWorkspaces(res.workspaces);
      setStep("choose");
    } catch (err: any) {
      setError(err?.message ?? "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      codeRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus();
    }
  }

  function ChooseStep() {
    const hasWorkspaces = (workspaces?.length ?? 0) > 0;
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>
            {hasWorkspaces
              ? "Join an existing workspace or create a new one"
              : "Create your first workspace"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasWorkspaces && (
            <div>
              <p className="text-sm font-medium mb-2">Your workspaces</p>
              <div className="grid gap-2">
                {workspaces!.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWorkspaceId(w.id);
                      setCreatingNew(false);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-md border p-3 text-left transition-colors",
                      selectedWorkspaceId === w.id
                        ? "border-primary ring-2 ring-primary/30"
                        : "hover:bg-accent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-muted-foreground" />
                      <span className="font-medium">{w.name}</span>
                    </div>
                    {selectedWorkspaceId === w.id && (
                      <Check className="size-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>

          <button
            onClick={() => {
              setCreatingNew(true);
              setSelectedWorkspaceId(null);
              setStep("survey");
            }}
            className="flex items-center justify-center gap-2 rounded-md border p-3 hover:bg-accent transition-colors"
          >
            <Plus className="size-4" /> Create a new workspace
          </button>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="ghost" onClick={() => setStep("verify")}>
            Back
          </Button>
          <Button
            disabled={!selectedWorkspaceId}
            onClick={async () => {
              if (!selectedWorkspaceId) return;
              setSubmitting(true);
              setError(null);
              try {
                try {
                  await apiClient.post("/workspaces/join", {
                    workspaceId: selectedWorkspaceId,
                    sessionToken,
                  });
                } catch {
                  await new Promise((r) => setTimeout(r, 250));
                }
                router.push(`/w/${selectedWorkspaceId}`);
                setStep("done");
              } catch (err: any) {
                setError(err?.message ?? "Failed to join workspace");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            Continue <ArrowRight className="size-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await (async () => {
        try {
          return await apiClient.post<CreateWorkspaceResponse>(
            "/workspaces/create",
            {
              name: survey.teamName || "My Workspace",
              context: survey,
              sessionToken,
            }
          );
        } catch {
          await new Promise((r) => setTimeout(r, 400));
          return {
            workspaceId: `demo-${Date.now()}`,
          } as CreateWorkspaceResponse;
        }
      })();
      const workspaceId = res.workspaceId;
      setSelectedWorkspaceId(workspaceId);
      setStep("build");

      // Kick off build process
      try {
        await apiClient.post("/workspaces/build", {
          workspaceId,
          sessionToken,
          context: survey,
        });
      } catch {
        // Mock: rely on simulated progress
      }

      // In real-time, socket will update progress. We finish with redirect.
      const finishTimer = setTimeout(() => {
        setBuildProgress(100);
        setBuildMessage("All set! Redirecting...");
        router.push(`/w/${workspaceId}`);
        setStep("done");
      }, 3500);
      return () => clearTimeout(finishTimer);
    } catch (err: any) {
      setError(err?.message ?? "Failed to create workspace");
      setStep("choose");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {step === "email" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Mail className="size-5" /> Sign in with your email
            </CardTitle>
            <CardDescription>
              We’ll send a 6-digit code. You can use a password instead later.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleStartLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  ref={emailRef}
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-xs text-muted-foreground">
                By continuing, you agree to our terms.
              </div>
              <Button type="submit" disabled={submitting || !email}>
                Continue <ArrowRight className="size-4 ml-1" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "verify" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ShieldCheck className="size-5" /> Enter the 6-digit code
            </CardTitle>
            <CardDescription>
              We sent a code to {email}. It expires in 10 minutes.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerifyCode}>
            <CardContent className="space-y-4">
              <div className="flex justify-between gap-2">
                {code.map((digit, idx) => (
                  <Input
                    key={idx}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    className="text-center text-lg h-12 w-12"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    ref={(el) => {
                      codeRefs.current[idx] = el;
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:underline"
                  onClick={() => setStep("password")}
                >
                  Use password instead
                </button>
                <button
                  type="button"
                  className="text-sm text-muted-foreground hover:underline"
                  onClick={async () => {
                    setSubmitting(true);
                    setError(null);
                    try {
                      try {
                        await apiClient.post("/auth/login/resend", {
                          email,
                          pendingToken,
                        });
                      } catch {
                        await new Promise((r) => setTimeout(r, 300));
                      }
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  Resend code
                </button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("email")}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={submitting || codeValue.length !== 6}
              >
                Continue <ArrowRight className="size-4 ml-1" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "password" && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Lock className="size-5" /> Enter your password
            </CardTitle>
            <CardDescription>
              Or go back to use the emailed code.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handlePasswordLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  ref={passwordRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("verify")}
              >
                Use code instead
              </Button>
              <Button
                type="submit"
                disabled={submitting || !email || !password}
              >
                Continue <ArrowRight className="size-4 ml-1" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "choose" && <ChooseStep />}

      {step === "survey" && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Tell us about your team</CardTitle>
            <CardDescription>
              This helps us tailor your workspace structure.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateWorkspace}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace name</label>
                <Input
                  placeholder="Acme Inc"
                  value={survey.teamName}
                  onChange={(e) =>
                    setSurvey((s) => ({ ...s, teamName: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Team size</label>
                  <select
                    className="h-9 rounded-md border px-3 text-sm bg-transparent"
                    value={survey.teamSize}
                    onChange={(e) =>
                      setSurvey((s) => ({ ...s, teamSize: e.target.value }))
                    }
                  >
                    {["1-5", "6-10", "11-25", "26-50", "51-100", "100+"].map(
                      (opt) => (
                        <option value={opt} key={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    placeholder="e.g. Engineering Manager"
                    value={survey.role}
                    onChange={(e) =>
                      setSurvey((s) => ({ ...s, role: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary use case</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Communication",
                    "Project Tracking",
                    "Support",
                    "Team Ops",
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => setSurvey((s) => ({ ...s, useCase: opt }))}
                      className={cn(
                        "rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        survey.useCase === opt
                          ? "border-primary ring-2 ring-primary/30"
                          : "hover:bg-accent"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            <CardFooter className="justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("choose")}
              >
                Back
              </Button>
              <Button type="submit" disabled={submitting || !survey.teamName}>
                Create workspace <ArrowRight className="size-4 ml-1" />
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "build" && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl">Setting up your workspace</CardTitle>
            <CardDescription>
              We’re provisioning channels, roles and realtime features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${Math.round(buildProgress)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{buildMessage}</span>
              <span className="font-medium">{Math.round(buildProgress)}%</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" disabled>
              Please wait...
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
