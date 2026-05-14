import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTrip, getDriver, formatDA } from "@/data/mock";
import { ArrowRight, Car, Bus, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/traveler/booking/$id")({
  head: () => ({ meta: [{ title: "Choix du siège — Wilaya Go" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const trip = getTrip(id);
  const nav = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);

  if (!trip) return <DashboardLayout role="traveler"><div>Trajet introuvable.</div></DashboardLayout>;
  const driver = getDriver(trip.driverId)!;
  const Icon = trip.transportType === "Taxi" ? Car : Bus;

  return (
    <DashboardLayout role="traveler" title="Choix du siège">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /> Sélectionnez votre siège</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center gap-4 text-xs">
              <Legend color="bg-muted" label="Disponible" />
              <Legend color="bg-destructive/40" label="Réservé" />
              <Legend color="bg-primary" label="Sélectionné" />
            </div>

            {trip.transportType === "Taxi" ? <TaxiLayout booked={trip.bookedSeats} selected={selected} onSelect={setSelected} />
              : <BusLayout total={trip.seatsTotal} booked={trip.bookedSeats} selected={selected} onSelect={setSelected} />}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card><CardContent className="space-y-3 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Récapitulatif</div>
            <div className="text-xl font-bold">{trip.fromWilaya} → {trip.toWilaya}</div>
            <div className="text-sm text-muted-foreground">{trip.date} · {trip.time} · {trip.estimatedDuration}</div>
            <div className="rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="font-semibold">{driver.name}</div>
              <div className="text-xs text-muted-foreground">{driver.vehicleBrand} {driver.vehicleModel} · {driver.plate}</div>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Siège</span>
              <Badge variant="secondary">{selected ? `N° ${selected}` : "Aucun"}</Badge>
            </div>
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Prix</span>
              <span className="text-2xl font-extrabold text-primary">{formatDA(trip.price)}</span></div>
            <Button className="w-full font-semibold" size="lg" disabled={!selected}
              onClick={() => nav({ to: "/traveler/payment/$id", params: { id }, search: { seat: selected! } as any })}>
              Continuer vers le paiement <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent></Card>
          <div className="flex items-start gap-2 rounded-lg border bg-success/10 p-3 text-xs text-success">
            <Shield className="mt-0.5 h-4 w-4" />
            <span>Votre paiement est protégé par le compte intermédiaire sécurisé.</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return <div className="flex items-center gap-2"><div className={cn("h-4 w-4 rounded border", color)} />{label}</div>;
}

function Seat({ n, booked, selected, onSelect }: { n: number; booked: boolean; selected: boolean; onSelect: () => void }) {
  return <button disabled={booked} onClick={onSelect}
    className={cn("flex h-12 w-12 items-center justify-center rounded-lg border-2 text-sm font-semibold transition-all",
      booked ? "cursor-not-allowed border-destructive/30 bg-destructive/30 text-destructive-foreground/50"
        : selected ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
        : "border-border bg-muted hover:border-primary")}>{n}</button>;
}

function TaxiLayout({ booked, selected, onSelect }: { booked: number[]; selected: number | null; onSelect: (n: number) => void }) {
  return (
    <div className="mx-auto w-fit rounded-2xl border-2 bg-muted/30 p-6">
      <div className="mb-4 text-center text-xs text-muted-foreground">Avant du véhicule</div>
      <div className="flex justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed text-xs text-muted-foreground">Chauffeur</div>
        <Seat n={1} booked={booked.includes(1)} selected={selected === 1} onSelect={() => onSelect(1)} />
      </div>
      <div className="mt-4 flex justify-center gap-3">
        {[2,3,4].map(n => <Seat key={n} n={n} booked={booked.includes(n)} selected={selected === n} onSelect={() => onSelect(n)} />)}
      </div>
    </div>
  );
}

function BusLayout({ total, booked, selected, onSelect }: { total: number; booked: number[]; selected: number | null; onSelect: (n: number) => void }) {
  const rows = Math.ceil(total / 4);
  return (
    <div className="mx-auto w-fit rounded-2xl border-2 bg-muted/30 p-6">
      <div className="mb-4 text-center text-xs text-muted-foreground">Avant du bus</div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-2">
            {[1,2].map(c => { const n = r*4+c; return n <= total ? <Seat key={n} n={n} booked={booked.includes(n)} selected={selected===n} onSelect={() => onSelect(n)} /> : <div key={n} className="h-12 w-12" />; })}
            <div className="w-6" />
            {[3,4].map(c => { const n = r*4+c; return n <= total ? <Seat key={n} n={n} booked={booked.includes(n)} selected={selected===n} onSelect={() => onSelect(n)} /> : <div key={n} className="h-12 w-12" />; })}
          </div>
        ))}
      </div>
    </div>
  );
}
