"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Check your email to verify your account.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-500">Work Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@clinic.com" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        Create Account
      </Button>
      <p className="text-xs text-slate-500">
        By continuing you agree to follow MedFlow security and compliance policies.
      </p>
      <Link href="/login" className="text-xs text-brand-600">
        Already have an account? Sign in
      </Link>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </form>
  );
}