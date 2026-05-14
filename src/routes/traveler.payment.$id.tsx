import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { getTrip, formatDA } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/traveler/payment/$id")({
  validateSearch: z.object({ seat: z.coerce.number().optional() }),
  head: () => ({ meta: [{ title: "Paiement — Wilaya Go" }] }),
  component: Page,
});

const METHODS = [
  { id: "BaridiMob", label: "BaridiMob", desc: "Paiement via Algérie Poste" },
  { id: "CIB", label: "Carte CIB", desc: "Carte interbancaire" },
  { id: "Edahabia", label: "Carte Edahabia", desc: "Algérie Poste" },
];

function Page() {
  const { id } = Route.useParams();
  const { seat = 1 } = Route.useSearch();
  const trip = getTrip(id);
  const nav = useNavigate();
  const [method, setMethod] = useState("BaridiMob");
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  if (!trip) return <DashboardLayout role="traveler"><div>Trajet introuvable.</div></DashboardLayout>;
  const fee = Math.round(trip.price * 0.08);
  const total = trip.price + fee;

  const pay = () => {
    setState("loading");
    setTimeout(() => {
      setState("success");
      toast.success("Paiement confirmé avec succès");
      setTimeout(() => nav({ to: "/traveler/ticket/$id", params: { id: "r1" } }), 1200);
    }, 1500);
  };

  return (
    <DashboardLayout role="traveler" title="Paiement">
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" /> Choisissez votre méthode de paiement</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {METHODS.map((m) => (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={cn("flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition-all",
                  method === m.id ? "border-primary bg-primary/5" : "hover:border-primary/50")}>
                <div>
                  <div className="font-bold">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                <div className={cn("h-5 w-5 rounded-full border-2", method === m.id ? "border-primary bg-primary" : "border-muted-foreground")} />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Récapitulatif</div>
            <div className="text-lg font-bold">{trip.fromWilaya} → {trip.toWilaya}</div>
            <div className="text-sm text-muted-foreground">{trip.date} · {trip.time} · Siège N° {seat}</div>
            <div className="space-y-1 border-t pt-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Prix du trajet</span><span>{formatDA(trip.price)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Frais de plateforme</span><span>{formatDA(fee)}</span></div>
              <div className="flex justify-between border-t pt-2 text-lg font-extrabold text-primary"><span>Total</span><span>{formatDA(total)}</span></div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border bg-success/10 p-3 text-xs text-success">
              <Shield className="mt-0.5 h-4 w-4" />
              <span>Le montant reste dans un compte intermédiaire sécurisé jusqu'à la confirmation de l'arrivée.</span>
            </div>
            <Button className="w-full font-semibold" size="lg" onClick={pay} disabled={state !== "idle"}>
              {state === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {state === "success" && <CheckCircle2 className="mr-2 h-4 w-4" />}
              {state === "idle" ? "Payer maintenant" : state === "loading" ? "Traitement..." : "Confirmé"}
            </Button>
            <Badge variant="secondary" className="w-full justify-center">Méthode : {method}</Badge>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
