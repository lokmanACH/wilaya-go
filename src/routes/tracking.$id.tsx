import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MapMock } from "@/components/MapMock";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, MessageSquare, Star, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getTrip, getDriver } from "@/data/mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking/$id")({
  head: () => ({ meta: [{ title: "Suivi GPS — Wilaya Go" }] }),
  component: Page,
});

const STEPS = ["Réservation confirmée","Paiement confirmé","Véhicule arrivé","Trajet démarré","En route","Arrivé"];

function Page() {
  const { id } = Route.useParams();
  const trip = getTrip(id) ?? getTrip("tr2")!;
  const driver = getDriver(trip.driverId)!;
  const [progress, setProgress] = useState(trip.progressPercentage || 35);
  const [step, setStep] = useState(4);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const it = setInterval(() => setProgress(p => Math.min(99, p + 1)), 3000);
    return () => clearInterval(it);
  }, []);

  return (
    <DashboardLayout role="traveler" title="Suivi GPS">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <MapMock from={trip.fromWilaya} to={trip.toWilaya} progress={progress} eta="1h 20min" vehicleLabel={`${trip.transportType} · ${driver.vehicleBrand} ${driver.vehicleModel}`} />
          <Card>
            <CardHeader><CardTitle>Étapes du trajet</CardTitle></CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      i <= step ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground")}>
                      {i <= step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={i <= step ? "font-semibold" : "text-muted-foreground"}>{s}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card><CardContent className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary text-primary-foreground">{driver.name[0]}</AvatarFallback></Avatar>
              <div><div className="font-bold">{driver.name}</div>
                <div className="text-xs text-muted-foreground">{driver.vehicleBrand} {driver.vehicleModel} · {driver.plate}</div></div>
            </div>
            <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" />{driver.rating}/5</div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1"><Phone className="mr-2 h-4 w-4" />Appeler</Button>
              <Button variant="outline" className="flex-1"><MessageSquare className="mr-2 h-4 w-4" />Message</Button>
            </div>
            <Badge variant="secondary" className="w-full justify-center bg-success/15 text-success">GPS actif · ETA 1h 20min</Badge>
          </CardContent></Card>

          <Button className="w-full font-semibold" size="lg" onClick={() => { setStep(5); setProgress(100); setOpen(true); }}>
            Confirmer l'arrivée
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluez votre trajet</DialogTitle>
            <DialogDescription>Votre avis aide les autres voyageurs à choisir.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={cn("h-9 w-9", n <= rating ? "fill-primary text-primary" : "text-muted-foreground")} />
                </button>
              ))}
            </div>
            <Textarea placeholder="Votre commentaire..." value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Plus tard</Button>
            <Button onClick={() => { setOpen(false); toast.success("Merci pour votre avis"); }}>Envoyer l'avis</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
