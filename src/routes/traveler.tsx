import { createFileRoute, useSearch, Link } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ticket, MapPin, Wallet, RefreshCcw, Star, Bell, Heart, Car, CheckCircle2 } from "lucide-react";
import { reservations, trips, payments, refunds, notifications, drivers, formatDA, getTrip, getDriver } from "@/data/mock";
import { QRTicket } from "@/components/QRTicket";

const tabs = ["overview","reservations","tickets","tracking","payments","refunds","reviews","notifications","favorites","settings"] as const;
type Tab = typeof tabs[number];

export const Route = createFileRoute("/traveler")({
  validateSearch: z.object({ tab: z.enum(tabs).optional() }),
  head: () => ({ meta: [{ title: "Voyageur — Wilaya Go" }] }),
  component: Page,
});

const TITLES: Record<Tab, string> = { overview:"Vue d'ensemble", reservations:"Mes réservations", tickets:"Mes billets QR", tracking:"Suivi GPS", payments:"Paiements", refunds:"Remboursements", reviews:"Avis", notifications:"Notifications", favorites:"Chauffeurs favoris", settings:"Paramètres" };

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = { Confirmée:"bg-success/15 text-success", "En attente":"bg-warning/15 text-warning-foreground", Annulée:"bg-destructive/15 text-destructive", Terminée:"bg-muted text-muted-foreground", Payé:"bg-success/15 text-success", Bloqué:"bg-warning/15 text-warning-foreground", Libéré:"bg-success/15 text-success", Remboursé:"bg-destructive/15 text-destructive", Effectué:"bg-success/15 text-success" };
  return <Badge variant="secondary" className={m[status] ?? ""}>{status}</Badge>;
}

function Stat({ label, value, icon: Icon }: any) {
  return <Card><CardContent className="p-5"><div className="flex items-start justify-between">
    <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div></div>
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
  </div></CardContent></Card>;
}

function Page() {
  const search = useSearch({ from: "/traveler" });
  const tab: Tab = search.tab ?? "overview";
  return (
    <DashboardLayout role="traveler" title={TITLES[tab]}>
      {tab === "overview" && <Overview />}
      {tab === "reservations" && <Reservations />}
      {tab === "tickets" && <Tickets />}
      {tab === "tracking" && <Tracking />}
      {tab === "payments" && <Payments />}
      {tab === "refunds" && <Refunds />}
      {tab === "reviews" && <Reviews />}
      {tab === "notifications" && <Notifications />}
      {tab === "favorites" && <Favorites />}
      {tab === "settings" && <Settings />}
    </DashboardLayout>
  );
}

function Overview() {
  const upcoming = reservations.filter(r => r.status === "Confirmée");
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Réservations à venir" value={upcoming.length} icon={Ticket} />
        <Stat label="Trajet actif" value="Oran → Alger" icon={MapPin} />
        <Stat label="Trajets passés" value="14" icon={CheckCircle2} />
        <Stat label="Paiements totaux" value={formatDA(48200)} icon={Wallet} />
        <Stat label="Remboursements" value={formatDA(2500)} icon={RefreshCcw} />
        <Stat label="Chauffeurs favoris" value="3" icon={Heart} />
        <Stat label="Notifications" value="5" icon={Bell} />
        <Stat label="Notes publiées" value="9" icon={Star} />
      </div>
      <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Prochain trajet</CardTitle>
        <Button asChild><Link to="/traveler/search">Rechercher un trajet</Link></Button></CardHeader>
        <CardContent>
          <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-transparent p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><div className="text-2xl font-bold">Alger → Batna</div>
                <div className="text-sm text-muted-foreground">16 mai 2026 · 07h30 · Taxi · Siège N° 2</div></div>
              <Button asChild><Link to="/tracking/$id" params={{ id: "tr1" }}>Suivre le trajet</Link></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Reservations() {
  return (
    <Card><CardHeader><CardTitle>Mes réservations</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto"><Table>
        <TableHeader><TableRow>
          <TableHead>Trajet</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead>
          <TableHead>Chauffeur</TableHead><TableHead>Siège</TableHead><TableHead>Prix</TableHead>
          <TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
        </TableRow></TableHeader>
        <TableBody>{reservations.map((r) => { const t = getTrip(r.tripId)!; const d = getDriver(t.driverId)!;
          return (<TableRow key={r.id}>
            <TableCell className="font-medium">{t.fromWilaya} → {t.toWilaya}</TableCell>
            <TableCell>{t.date} · {t.time}</TableCell>
            <TableCell>{t.transportType}</TableCell>
            <TableCell>{d.name}</TableCell>
            <TableCell>N° {r.seatNumber}</TableCell>
            <TableCell>{formatDA(t.price)}</TableCell>
            <TableCell><StatusBadge status={r.status} /></TableCell>
            <TableCell className="text-right"><div className="flex justify-end gap-1">
              <Button size="sm" variant="outline" asChild><Link to="/traveler/ticket/$id" params={{ id: r.id }}>Voir billet</Link></Button>
              <Button size="sm" asChild><Link to="/tracking/$id" params={{ id: t.id }}>Suivre</Link></Button>
            </div></TableCell>
          </TableRow>); })}
        </TableBody>
      </Table></CardContent>
    </Card>
  );
}

function Tickets() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {reservations.slice(0, 4).map((r) => { const t = getTrip(r.tripId)!; const d = getDriver(t.driverId)!;
        return <QRTicket key={r.id} travelerName="Sara Meziane" reservationId={`WG-${r.id.toUpperCase()}`} from={t.fromWilaya} to={t.toWilaya} date={t.date} time={t.time} seat={r.seatNumber} driverName={d.name} vehicle={`${d.vehicleBrand} ${d.vehicleModel}`} />;
      })}
    </div>
  );
}

function Tracking() {
  return (
    <Card><CardContent className="p-6 text-center">
      <p className="text-muted-foreground">Sélectionnez un trajet en cours pour ouvrir le suivi GPS.</p>
      <Button className="mt-4" asChild><Link to="/tracking/$id" params={{ id: "tr2" }}>Ouvrir le suivi du trajet actif</Link></Button>
    </CardContent></Card>
  );
}

function Payments() {
  return (
    <Card><CardHeader><CardTitle>Historique des paiements</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto"><Table>
        <TableHeader><TableRow>
          <TableHead>Transaction</TableHead><TableHead>Trajet</TableHead>
          <TableHead>Montant</TableHead><TableHead>Méthode</TableHead>
          <TableHead>Compte intermédiaire</TableHead><TableHead>Statut</TableHead><TableHead>Date</TableHead>
        </TableRow></TableHeader>
        <TableBody>{payments.map((p) => { const r = reservations.find(x => x.id === p.reservationId); const t = r && getTrip(r.tripId);
          return (<TableRow key={p.transactionId}>
            <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
            <TableCell>{t ? `${t.fromWilaya} → ${t.toWilaya}` : "—"}</TableCell>
            <TableCell>{formatDA(p.total)}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell><StatusBadge status={p.escrowStatus} /></TableCell>
            <TableCell><StatusBadge status={p.status} /></TableCell>
            <TableCell>{p.createdAt.split("T")[0]}</TableCell>
          </TableRow>); })}
        </TableBody>
      </Table></CardContent>
    </Card>
  );
}

function Refunds() {
  return (
    <Card><CardHeader><CardTitle>Mes remboursements</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto"><Table>
        <TableHeader><TableRow>
          <TableHead>Transaction</TableHead><TableHead>Montant</TableHead>
          <TableHead>Motif</TableHead><TableHead>Date</TableHead><TableHead>Statut</TableHead>
        </TableRow></TableHeader>
        <TableBody>{refunds.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-mono text-xs">{r.transactionId}</TableCell>
            <TableCell>{formatDA(r.amount)}</TableCell>
            <TableCell>{r.reason}</TableCell>
            <TableCell>{r.date}</TableCell>
            <TableCell><StatusBadge status={r.status} /></TableCell>
          </TableRow>))}
        </TableBody>
      </Table></CardContent>
    </Card>
  );
}

function Reviews() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[{ d: "Ahmed Benali", r: 5, t: "Très professionnel et ponctuel." },
        { d: "Karim Mansouri", r: 4, t: "Bus confortable, climatisation correcte." }].map((x, i) => (
        <Card key={i}><CardContent className="space-y-2 p-5">
          <div className="flex items-center justify-between"><div className="font-semibold">{x.d}</div>
            <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" /> {x.r}/5</div></div>
          <p className="text-sm text-muted-foreground">{x.t}</p>
        </CardContent></Card>))}
    </div>
  );
}

function Notifications() {
  const iconMap: Record<string, any> = { check: CheckCircle2, card: Wallet, bell: Bell, car: Car, refund: RefreshCcw };
  return (
    <div className="space-y-3">{notifications.map((n) => { const Icon = iconMap[n.icon] ?? Bell;
      return (<Card key={n.id}><CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
        <div className="flex-1"><div className="font-semibold">{n.title}</div><div className="text-sm text-muted-foreground">{n.body}</div></div>
        <div className="text-xs text-muted-foreground">{n.time}</div>
      </CardContent></Card>); })}
    </div>
  );
}

function Favorites() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drivers.slice(0, 3).map((d) => (
        <Card key={d.id}><CardContent className="space-y-3 p-5">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12"><AvatarFallback className="bg-primary text-primary-foreground">{d.name[0]}</AvatarFallback></Avatar>
            <div><div className="font-bold">{d.name}</div>
              <div className="text-xs text-muted-foreground">{d.transportType} · {d.wilaya}</div></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span><Star className="mr-1 inline h-4 w-4 fill-primary text-primary" />{d.rating}/5</span>
            <span className="text-muted-foreground">{d.trips} trajets</span>
          </div>
          <Button className="w-full" variant="outline">Voir les trajets</Button>
        </CardContent></Card>))}
    </div>
  );
}

function Settings() {
  return (
    <Card><CardHeader><CardTitle>Mon compte</CardTitle></CardHeader>
      <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
        {[["Nom","Sara Meziane"],["Téléphone","+213 555 90 12 34"],["Email","sara.m@gmail.com"],["Wilaya","Alger"],["Compte","Vérifié"],["OTP","Activé"]].map(([k,v]) => (
          <div key={k} className="rounded-lg border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</div>
            <div className="font-semibold">{v}</div>
          </div>))}
      </CardContent>
    </Card>
  );
}
