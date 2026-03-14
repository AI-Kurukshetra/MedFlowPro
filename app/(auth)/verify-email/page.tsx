import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify your email"
      subtitle="We sent a verification link to your inbox."
      showHelper={false}
    >
      <div className="space-y-4 text-sm text-slate-600">
        <p>Open the email from MedFlow Pro and confirm your address to activate your account.</p>
        <Link href="/login">
          <Button className="w-full">Return to Sign In</Button>
        </Link>
      </div>
    </AuthCard>
  );
}
