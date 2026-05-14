import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
        <Car className="h-5 w-5" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-lg font-extrabold tracking-tight">
            Wilaya<span className="text-primary">Go</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Inter-wilayas
          </div>
        </div>
      )}
    </div>
  );
}
