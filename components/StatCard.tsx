import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string;
  helper?: string;
  trend?: string;
  accent?: "default" | "success" | "warning" | "critical";
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "text-slate-900",
  success: "text-emerald-600",
  warning: "text-amber-600",
  critical: "text-rose-600"
};

export function StatCard({ title, value, helper, trend, accent = "default" }: StatCardProps) {
  return (
    <Card className="stat-card transition-shadow hover:shadow-lg">
      <CardContent>
        <p className="caption uppercase tracking-wide">{title}</p>
        <p className={cn("mt-2 text-3xl font-semibold", accentStyles[accent])}>{value}</p>
        {helper && <p className="text-xs text-slate-400">{helper}</p>}
        {trend && (
          <div className="mt-4 inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}