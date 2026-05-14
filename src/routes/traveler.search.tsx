import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SearchCard } from "@/components/SearchCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, Users as UsersIcon, ArrowRight } from "lucide-react";
import { trips, getDriver, formatDA } from "@/data/mock";

export const Route = createFileRoute("/traveler/search")({
  validateSearch: z.object({ from: z.string().optional(), to: z.string().optional(), date: z.string().optional(), type: z.enum(["Taxi","Bus"]).optional() }),
  head: () => ({ meta: [{ title: "Rechercher un trajet — Wilaya Go" }] }),
  component: Page,
});

function Page() {
  const s = Route.useSearch();
  const filtered = trips.filter(t => (!s.from || t.fromWilaya === s.from) && (!s.to || t.toWilaya === s.to) && (!s.type || t.transportType === s.type));
  const list = filtered.length ? filtered : trips;
  return (
    <DashboardLayout role="traveler" title="Rechercher un trajet">
      <div className="space-y-6">
        <SearchCard compact />
        <div className="text-sm text-muted-foreground">{list.length} trajet(s) disponible(s)</div>
        <div className="grid gap-4">
          {list.map((t) => { const d = getDriver(t.driverId)!;
            return (
              <Card key={t.id} className="transition-all hover:shadow-lg">
                <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11"><AvatarFallback className="bg-primary text-primary-foreground">{d.name[0]}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-bold">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.vehicleBrand} {d.vehicleModel} · {t.transportType}</div>
                      </div>
                      <Badge variant="secondary" className="ml-auto bg-success/15 text-success">Vérifié</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-bold">{t.fromWilaya}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-bold">{t.toWilaya}</span>
                      <span className="ml-2 text-muted-foreground">· {t.date} à {t.time}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span><Clock className="mr-1 inline h-3 w-3" />{t.estimatedDuration}</span>
                      <span><Star className="mr-1 inline h-3 w-3 fill-primary text-primary" />{t.rating}/5</span>
                      <span><UsersIcon className="mr-1 inline h-3 w-3" />{t.seatsAvailable} places restantes</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-2xl font-extrabold text-primary">{formatDA(t.price)}</div>
                    <Button asChild className="font-semibold" disabled={t.seatsAvailable === 0}>
                      <Link to="/traveler/booking/$id" params={{ id: t.id }}>Réserver maintenant</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
