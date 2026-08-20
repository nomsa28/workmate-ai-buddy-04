import { Loader2, AlertTriangle, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export function OutputPanel({
  loading,
  error,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty: string;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14 text-sm text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" />
        Generating with AI…
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <p>{error}</p>
      </div>
    );
  }
  if (!children) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-14 text-center text-sm text-muted-foreground">
        <Sparkles className="size-6 text-primary/60" />
        {empty}
      </div>
    );
  }
  return <>{children}</>;
}
