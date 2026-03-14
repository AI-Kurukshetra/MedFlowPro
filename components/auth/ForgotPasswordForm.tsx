"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Password reset link sent. Check your email.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-500">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@clinic.com" />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        Send Reset Link
      </Button>
      <Link href="/login" className="text-xs text-brand-600">
        Return to sign in
      </Link>
      {message && <p className="text-sm text-slate-500">{message}</p>}
    </form>
  );
}