import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  showHelper?: boolean;
  children: React.ReactNode;
}

export function AuthCard({ title, subtitle, footer, showHelper = true, children }: AuthCardProps) {
  return (
    <Card className="glass-panel rounded-3xl border border-white/30 bg-white/80">
      <CardContent>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">MedFlow Pro</p>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
        {footer && <div className="mt-6 text-sm text-slate-500">{footer}</div>}
        {showHelper && (
          <div className="mt-8 text-xs text-slate-400">
            Need access? <Link href="/signup" className="text-brand-600">Request an account</Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}