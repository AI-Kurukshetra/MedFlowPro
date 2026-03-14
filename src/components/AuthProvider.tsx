"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") {
        // Token refreshed silently — no action needed
        return;
      }

      if (event === "SIGNED_OUT") {
        router.push("/login");
        return;
      }

      if (event === "SIGNED_IN" && session) {
        // Refresh server components when sign-in is detected
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return <>{children}</>;
}
