
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { label: "Superadmin", email: "superadmin@example.com" },
  { label: "Tenant Admin", email: "admin@example.com" },
  { label: "Team Member", email: "member@example.com" },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("superadmin@example.com");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left brand panel */}
        <section className="relative hidden overflow-hidden bg-linear-135 from-slate-900 via-slate-900 to-indigo-950 p-10 lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Zap size={23} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                ProjectFlow
              </h1>
              <p className="text-xs text-slate-400">
                Project Management Platform
              </p>
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              <ShieldCheck size={16} />
              Secure workspace management
            </div>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Manage your team.
              <span className="mt-2 block bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Deliver great work.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
              Bring your projects, teams, and tasks together in one organized
              workspace. Stay focused and keep every project moving forward.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Users size={21} />
                </div>
                <h3 className="font-semibold">Team collaboration</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Keep your team connected and organized.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <ShieldCheck size={21} />
                </div>
                <h3 className="font-semibold">Role-based access</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Give users access based on their responsibilities.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-500">
            © 2026 ProjectFlow. Built for productive teams.
          </p>
        </section>

        {/* Right login panel */}
        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Zap size={23} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">ProjectFlow</h1>
                <p className="text-xs text-slate-400">
                  Project Management Platform
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <LockKeyhole size={24} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Sign in to access your workspace and manage your projects.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <span className="text-xs text-slate-500">
                    Demo environment
                  </span>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in to workspace"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-500">
                  QUICK DEMO ACCESS
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword("demo123");
                      setError("");
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                      email === account.email
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-200">
                      {account.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {account.email}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                Demo password: <span className="text-slate-300">demo123</span>
              </p>
            </div>

            <p className="mt-8 text-center text-xs leading-5 text-slate-500">
              By signing in, you agree to use this demo workspace responsibly.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
