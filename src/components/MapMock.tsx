import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Car, MapPin, Navigation } from "lucide-react";

interface MapMockProps {
  from: string;
  to: string;
  progress: number;
  eta?: string;
  vehicleLabel?: string;
}

export function MapMock({ from, to, progress, eta = "—", vehicleLabel = "Véhicule" }: MapMockProps) {
  const clamped = Math.min(100, Math.max(0, progress));
  return (
    <Card className="overflow-hidden">
      <div className="map-grid relative h-72 w-full bg-muted/30">
        {/* Route line */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 280" preserveAspectRatio="none">
          <path
            d="M 40 220 C 120 80, 260 260, 360 60"
            stroke="var(--color-primary)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
          <path
            d="M 40 220 C 120 80, 260 260, 360 60"
            stroke="var(--color-primary)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${clamped} 100`}
          />
        </svg>

        {/* Start pin */}
        <div className="absolute left-[8%] top-[72%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="mt-1 rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold shadow">
            {from}
          </div>
        </div>

        {/* End pin */}
        <div className="absolute right-[6%] top-[18%] flex translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="mt-1 rounded-md bg-card px-2 py-0.5 text-[11px] font-semibold shadow">
            {to}
          </div>
        </div>

        {/* Vehicle marker — positioned along path */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
          style={{
            left: `${10 + (clamped / 100) * 78}%`,
            top: `${75 - (clamped / 100) * 60}%`,
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl ring-4 ring-primary/30">
            <Car className="h-5 w-5" />
          </div>
        </div>

        <Badge className="absolute left-3 top-3 gap-1" variant="secondary">
          <Navigation className="h-3 w-3" /> Carte simulée
        </Badge>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{vehicleLabel}</span>
          <span className="text-muted-foreground">ETA · {eta}</span>
        </div>
        <Progress value={clamped} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{from}</span>
          <span className="font-semibold text-foreground">{clamped}%</span>
          <span>{to}</span>
        </div>
      </CardContent>
    </Card>
  );
}
