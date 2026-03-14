import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthCard
      title="Request access"
      subtitle="Create a MedFlow Pro account for your organization."
      showHelper={false}
    >
      <SignupForm />
    </AuthCard>
  );
}
