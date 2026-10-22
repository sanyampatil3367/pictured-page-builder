import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/vyra/shell";

type Role = "student" | "worker" | "admin";

type AuthUser = {
  email: string;
  role: Role;
  collegeCode: string;
  name: string;
  verificationStatus: "verified" | "pending";
};

type DemoDatasetUser = {
  email: string;
  name: string;
  role: Role;
  collegeCode: string;
  status: "active" | "pending";
};

const DEMO_DATASET: DemoDatasetUser[] = [
  {
    email: "student@vyra.demo",
    name: "Ratnesh",
    role: "student",
    collegeCode: "DSCE001",
    status: "active",
  },
  {
    email: "worker@vyra.demo",
    name: "Campus Worker",
    role: "worker",
    collegeCode: "DSCE001",
    status: "active",
  },
  {
    email: "admin@vyra.demo",
    name: "Campus Admin",
    role: "admin",
    collegeCode: "DSCE001",
    status: "active",
  },
];

const SESSION_KEY = "vyra-auth-session";
const GOOGLE_EMAIL_KEY = "vyra-demo-google-email";

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(SESSION_KEY);

    if (!stored) return null;

    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function LoginScreen({
  onLogin,
}: {
  onLogin: (user: AuthUser) => void;
}) {
  const [stage, setStage] = useState<
    "college" | "login" | "role" | "verification"
  >("college");

  const [collegeCode, setCollegeCode] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  function continueWithCollegeCode(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const code = collegeCode.trim().toUpperCase();

    if (code !== "DSCE001") {
      setError("College code not found.");
      return;
    }

    setCollegeCode(code);
    setError("");
    setStage("login");
  }

  function loginWithPassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    const datasetUser = DEMO_DATASET.find(
      (user) =>
        user.email === normalizedEmail &&
        user.collegeCode === collegeCode,
    );

    if (!datasetUser) {
      setError(
        "This account was not found in the college dataset.",
      );
      return;
    }

    if (!password.trim()) {
      setError("Enter your password.");
      return;
    }

    setGoogleEmail(normalizedEmail);
    setStage("role");
    setError("");
  }

  function continueWithGoogle() {
    /*
     * FRONTEND DEMO ONLY.
     *
     * Later this will be replaced with real Google OAuth.
     * For now we simulate Google identifying the account.
     */

    const demoGoogleEmail = "student@vyra.demo";

    window.localStorage.setItem(
      GOOGLE_EMAIL_KEY,
      demoGoogleEmail,
    );

    setGoogleEmail(demoGoogleEmail);
    setError("");
    setStage("role");
  }

  function verifySelectedRole() {
    if (!selectedRole) {
      setError("Select your role first.");
      return;
    }

    const datasetUser = DEMO_DATASET.find(
      (user) =>
        user.email === googleEmail &&
        user.collegeCode === collegeCode,
    );

    if (!datasetUser) {
      setError(
        "Your Google account was not found in the college dataset.",
      );
      setStage("verification");
      return;
    }

    if (datasetUser.role !== selectedRole) {
      setError(
        `This account is registered as ${datasetUser.role}, not ${selectedRole}.`,
      );
      return;
    }

    if (datasetUser.status !== "active") {
      setError(
        "This account is currently awaiting college verification.",
      );
      return;
    }

    const authenticatedUser: AuthUser = {
      email: datasetUser.email,
      name: datasetUser.name,
      role: datasetUser.role,
      collegeCode: datasetUser.collegeCode,
      verificationStatus: "verified",
    };

    saveUser(authenticatedUser);
    onLogin(authenticatedUser);
  }

  function submitVerificationRequest(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    /*
     * FRONTEND DEMO ONLY.
     *
     * Later this will create a real verification request
     * in Supabase for a college administrator to review.
     */

    setError("");
    setStage("verification");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <span className="text-2xl font-semibold">V</span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              VYRA
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Intelligent campus operations platform
            </p>
          </div>

          <div className="rounded-3xl border bg-card p-6 shadow-xl">
            {stage === "college" && (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    College access
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Enter your college code
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Your college code connects you to the correct
                    VYRA campus.
                  </p>
                </div>

                <form
                  onSubmit={continueWithCollegeCode}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="college-code"
                      className="mb-2 block text-sm font-medium"
                    >
                      College code
                    </label>

                    <input
                      id="college-code"
                      value={collegeCode}
                      onChange={(event) =>
                        setCollegeCode(event.target.value)
                      }
                      placeholder="e.g. DSCE001"
                      autoComplete="off"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Continue
                  </button>
                </form>
              </>
            )}

            {stage === "login" && (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    {collegeCode}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Sign in to VYRA
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Use your college account to continue.
                  </p>
                </div>

                <form
                  onSubmit={loginWithPassword}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@college.edu"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Sign in
                  </button>
                </form>

                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <button
                  type="button"
                  onClick={continueWithGoogle}
                  className="w-full rounded-xl border bg-background px-4 py-3 text-sm font-medium transition hover:bg-accent"
                >
                  Continue with Google
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage("college");
                    setError("");
                  }}
                  className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Change college
                </button>
              </>
            )}

            {stage === "role" && (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    {collegeCode}
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    Select your role
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    VYRA will verify this role against your college
                    record.
                  </p>
                </div>

                <div className="space-y-3">
                  {(
                    [
                      ["student", "Student"],
                      ["worker", "Worker"],
                      ["admin", "Admin"],
                    ] as const
                  ).map(([role, label]) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role);
                        setError("");
                      }}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                        selectedRole === role
                          ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                          : "bg-background hover:bg-accent"
                      }`}
                    >
                      <p className="font-medium">{label}</p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Continue as {label.toLowerCase()}
                      </p>
                    </button>
                  ))}
                </div>

                {error && (
                  <p className="mt-4 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={verifySelectedRole}
                  className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Verify & Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStage("login");
                    setSelectedRole(null);
                    setError("");
                  }}
                  className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Back to sign in
                </button>
              </>
            )}

            {stage === "verification" && (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-primary">
                    Verification required
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                    We couldn&apos;t verify your account
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Your account is not currently present in the
                    college dataset. You can request verification.
                  </p>
                </div>

                <form
                  onSubmit={submitVerificationRequest}
                  className="space-y-4"
                >
                  <div>
                    <label
                      htmlFor="verification-email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Google account
                    </label>

                    <input
                      id="verification-email"
                      value={googleEmail}
                      readOnly
                      className="w-full rounded-xl border bg-muted px-4 py-3 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Requested role
                    </label>

                    <div className="rounded-xl border bg-muted px-4 py-3 text-sm capitalize">
                      {selectedRole ?? "Not selected"}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    Request Verification
                  </button>
                </form>

                {error && (
                  <p className="mt-4 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStage("role");
                    setError("");
                  }}
                  className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            VYRA · Intelligent campus operations
          </p>
        </div>
      </div>
    </main>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">
          404
        </h1>

        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has
          been moved.
        </p>

        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({
  error,
  reset,
}: ErrorComponentProps) {
  console.error(error);

  const router = useRouter();

  useEffect(() => {
    reportLovableError(error, {
      boundary: "tanstack_root_error_component",
    });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn&apos;t load
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Something unexpected happened while loading the page.
        </p>

        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => reset()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>

          <button
            onClick={() => router.navigate({ to: "/" })}
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,

  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "VYRA — Intelligent Campus Operations",
      },
    ],

    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootShell,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>

      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setReady(true);
  }, []);

  function handleLogout() {
    window.localStorage.removeItem(SESSION_KEY);
    window.localStorage.removeItem(GOOGLE_EMAIL_KEY);

    setUser(null);
  }

  if (!ready) {
    return null;
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell onLogout={handleLogout}>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}