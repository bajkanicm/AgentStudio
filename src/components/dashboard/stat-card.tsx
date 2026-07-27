import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  /** 0..1 renders a limit bar; >0.85 turns amber. */
  progress?: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              progress > 0.85 ? "bg-amber-400" : "bg-primary"
            )}
            style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
          />
        </div>
      )}
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
