import { redirect } from "next/navigation";
import { getUserAndRoles } from "@/lib/auth/roles";
import { getRedirectForRoles } from "@/lib/auth/redirect";
import { LoginForm } from "@/components/auth/LoginForm";
import { Stethoscope, HeartPulse, ShieldCheck } from "lucide-react";

export default async function LoginPage() {
  const { user, roles } = await getUserAndRoles();
  if (user) {
    redirect(getRedirectForRoles(roles));
  }

  return (
    <div className="w-full max-w-[1100px] overflow-hidden rounded-xl bg-white shadow-lg md:grid md:grid-cols-2">
      <div className="p-10">
        <h1 className="text-3xl font-semibold text-slate-900">Login To Your Account!</h1>
        <p className="mt-2 text-sm text-slate-500">Access your MedFlow Pro workspace.</p>
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden items-center justify-center bg-gradient-to-br from-primary-200 via-primary-100 to-white md:flex">
        <div className="absolute left-10 top-10 h-24 w-24 rounded-full bg-white/70 blur-2xl" />
        <div className="absolute bottom-10 right-10 h-32 w-32 rounded-full bg-primary-300/40 blur-2xl" />
        <div className="relative rounded-3xl bg-white/70 p-10 shadow-lg">
          <div className="flex items-center gap-3 text-primary-700">
            <Stethoscope className="h-8 w-8" />
            <div>
              <p className="text-sm font-semibold">Clinical Workspace</p>
              <p className="text-xs text-slate-500">Safe prescribing tools</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4">
              <HeartPulse className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Patient Intelligence</p>
                <p className="text-xs text-slate-500">Interaction alerts in real time</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/80 p-4">
              <ShieldCheck className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">HIPAA-ready</p>
                <p className="text-xs text-slate-500">Audit logs and secure workflows</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}