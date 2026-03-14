"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const meta = user.user_metadata;
        await supabase.from("user_profiles").upsert({
          id: user.id,
          email: user.email!,
          full_name: meta?.full_name || user.email!.split("@")[0],
          role: meta?.role || "doctor",
        });
        profile = { role: meta?.role || "doctor" };
      }

      if (profile?.role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }

    setLoading(false);
  };

  const highlights = [
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      text: "Real-time drug interaction checks",
    },
    {
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      text: "Secure, HIPAA-ready patient data",
    },
    {
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      text: "Instant e-prescriptions for any patient",
    },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="auth-showcase auth-showcase-login hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 border border-white/15 backdrop-blur rounded-xl flex items-center justify-center shadow-[0_12px_30px_rgba(8,145,178,0.18)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">MedFlow Pro</span>
          </div>

          <p className="eyebrow mb-4">AI medication operations</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            AI-Powered
            <br />
            Medication Management
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            Smart prescriptions, interaction alerts, and patient records all in one
            workspace.
          </p>
        </div>

        <div className="relative space-y-4">
          {highlights.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
              </div>
              <span className="text-slate-200 text-sm">{item.text}</span>
            </div>
          ))}

          <div className="pt-6 mt-2 border-t border-white/10">
            <p className="text-slate-400 text-xs">
              Trusted by healthcare professionals worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="auth-panel w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/65 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.52)] backdrop-blur-2xl">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-[0_12px_30px_rgba(14,165,233,0.22)]">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-100">
              MedFlow <span className="text-sky-300">Pro</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="eyebrow mb-3">Secure sign in</p>
            <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
            <p className="text-slate-400 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-400/20 text-rose-100 px-4 py-3 rounded-xl mb-5 text-sm">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-sm mt-2"
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-sky-300 hover:text-sky-200 font-semibold">
              Create account
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-3">
              Demo credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sky-500/8 border border-sky-400/15 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-400/15 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-sky-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-sky-300">Doctor</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  dr.smith@medflow.com
                  <br />
                  <span className="text-slate-500">password123</span>
                </p>
              </div>
              <div className="bg-emerald-500/8 border border-emerald-400/15 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-400/15 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-emerald-300">Patient</span>
                </div>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  john.doe@email.com
                  <br />
                  <span className="text-slate-500">password123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
