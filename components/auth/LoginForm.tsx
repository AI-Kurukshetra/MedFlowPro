"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }

      const roleRedirects = [
        { role: "admin", path: "/admin/overview" },
        { role: "provider", path: "/provider/dashboard" },
        { role: "pharmacy", path: "/pharmacy/queue" },
        { role: "patient", path: "/patient/medications" },
        { role: "staff", path: "/provider/dashboard" }
      ];

      for (const role of roleRedirects) {
        const { data } = await supabase.rpc("has_role", { role_name: role.role });
        if (data) {
          router.replace(role.path);
          router.refresh();
          return;
        }
      }

      router.replace("/provider/dashboard");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-600">Email</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@clinic.com" />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Password</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-500">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Remember me
        </label>
        <Link href="/forgot-password" className="text-primary-600 hover:text-primary-700">
          Forgot Password
        </Link>
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        Login
      </Button>
      <p className="text-xs text-slate-500">
        Not Registered Yet?{" "}
        <Link href="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
          Sign Up
        </Link>
      </p>
      {message && <p className="text-sm text-rose-600">{message}</p>}
    </form>
  );
}