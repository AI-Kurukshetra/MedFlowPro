"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "doctor" as "doctor" | "patient",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      if (formData.role === "patient") {
        router.push("/patient/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } else {
      setError("Please check your email to confirm your account, then sign in.");
    }

    setLoading(false);
  };

  const roles = [
    {
      value: "doctor" as const,
      label: "Doctor",
      description: "Manage patients and prescriptions",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      value: "patient" as const,
      label: "Patient",
      description: "View your medications and history",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  const highlights = [
    "Free to get started, no credit card required",
    "Set up your practice in under 5 minutes",
    "Enterprise-grade security built in",
  ];

  return (
    <div className="min-h-screen flex">
      <div className="auth-showcase auth-showcase-signup hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden border-r border-white/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/8 rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/10 border border-white/15 backdrop-blur rounded-xl flex items-center justify-center shadow-[0_12px_30px_rgba(16,185,129,0.18)]">
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

          <p className="eyebrow mb-4 text-emerald-300/80">Practice onboarding</p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Join thousands of
            <br />
            healthcare providers
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
            Start managing medications smarter with AI-powered insights and real-time safety
            checks.
          </p>
        </div>

        <div className="relative space-y-4">
          {highlights.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-slate-200 text-sm">{item}</span>
            </div>
          ))}

          <div className="pt-6 mt-2 border-t border-white/10">
            <p className="text-slate-400 text-xs">
              Already have an account?{" "}
              <Link href="/login" className="text-white font-semibold hover:underline">
                Sign in
              </Link>
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
            <p className="eyebrow mb-3">Start in minutes</p>
            <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
            <p className="text-slate-400 mt-1 text-sm">Get started in less than a minute</p>
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

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="label">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isSelected = formData.role === role.value;
                  const selectedClass =
                    role.value === "doctor"
                      ? "border-sky-400/40 bg-sky-500/10 shadow-[0_14px_40px_rgba(14,165,233,0.14)]"
                      : "border-emerald-400/40 bg-emerald-500/10 shadow-[0_14px_40px_rgba(16,185,129,0.14)]";
                  const iconClass =
                    role.value === "doctor"
                      ? "bg-sky-400/15 text-sky-300"
                      : "bg-emerald-400/15 text-emerald-300";

                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`relative flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all duration-200 ${
                        isSelected
                          ? selectedClass
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected ? iconClass : "bg-white/10 text-slate-400"
                        }`}
                      >
                        {role.icon}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            isSelected
                              ? role.value === "doctor"
                                ? "text-sky-200"
                                : "text-emerald-200"
                              : "text-slate-200"
                          }`}
                        >
                          {role.label}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                      </div>
                      {isSelected && (
                        <div
                          className={`absolute top-3 right-3 w-4 h-4 rounded-full flex items-center justify-center ${
                            role.value === "doctor" ? "bg-sky-400" : "bg-emerald-400"
                          }`}
                        >
                          <svg className="w-2.5 h-2.5 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label" htmlFor="fullName">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="input-field"
                placeholder={formData.role === "doctor" ? "Dr. Jane Smith" : "John Doe"}
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field"
                placeholder="Min. 6 characters"
                minLength={6}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm">
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-sky-300 hover:text-sky-200 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
