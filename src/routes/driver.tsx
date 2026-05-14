import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import { ScanLine, CheckCircle2, Star, MapPin, Wallet, Users, Car, TrendingUp } from "lucide-react";
import { trips as tripsData, reservations as reservationsData, travelers, monthlyRevenue, formatDA, getTraveler, getTrip } from "@/data/mock";
import { toast } from "sonner";

const tabs = ["overview","trips","reservations","passengers","scan","earnings","reviews","notifications","settings"] as const;
type Tab = typeof tabs[number];

export const Route = createFileRoute("/driver")({
  validateSearch: z.object({ tab: z.enum(tabs).optional() }),
  head: () => ({ meta: [{ title: "Chauffeur — Wilaya Go" }] }),
  component: DriverPage,
});

const TITLES: Record<Tab, string> = { overview:"Vue d'ensemble", trips:"Mes trajets", reservations:"Réservations", passengers:"Passagers", scan:"Scanner QR", earnings:"Revenus", reviews:"Avis", notifications:"Notifications", settings:"Paramètres" };

function StatCard({ label, value, icon: Icon }: any) {
  return (
    <Card><CardContent className="p-5">
      <div className="flex items-start justify-between">
        <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-extrabold">{value}</div></div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></div>
      </div>
    </CardContent></Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, string> = {
    Disponible:"bg-success/15 text-success", "En cours":"bg-primary/15 text-primary",
    Terminé:"bg-muted text-muted-foreground", Annulé:"bg-destructive/15 text-destructive",
    Confirmée:"bg-success/15 text-success", "En attente":"bg-warning/15 text-warning-foreground",
    Actif:"bg-success/15 text-success", Inactif:"bg-muted text-muted-foreground",
  };
  return <Badge variant="secondary" className={m[status] ?? ""}>{status}</Badge>;
}

function DriverPage() {
  const search = useSearch({ from: "/driver" });
  const tab: Tab = search.tab ?? "overview";
  return (
    <DashboardLayout role="driver" title={TITLES[tab]}>
      {tab === "overview" && <Overview />}
      {tab === "trips" && <TripsTab />}
      {tab === "reservations" && <ReservationsTab />}
      {tab === "passengers" && <PassengersTab />}
      {tab === "scan" && <ScanTab />}
      {tab === "earnings" && <EarningsTab />}
      {tab === "reviews" && <ReviewsTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "settings" && <SettingsTab />}
    </DashboardLayout>
  );
}

function Overview() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Trajets publiés" value="24" icon={Car} />
        <StatCard label="Réservations du jour" value="18" icon={CheckCircle2} />
        <StatCard label="Passagers transportés" value="312" icon={Users} />
        <StatCard label="Revenus du mois" value={formatDA(248000)} icon={Wallet} />
        <StatCard label="Solde actuel" value={formatDA(86400)} icon={Wallet} />
        <StatCard label="Paiements reçus" value={formatDA(162000)} icon={TrendingUp} />
        <StatCard label="Note moyenne" value="4.8 / 5" icon={Star} />
        <StatCard label="Taux de remplissage" value="87 %" icon={TrendingUp} />
      </div>
      <Card>
        <CardHeader><CardTitle>Revenus mensuels</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue.slice(-6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mois" fontSize={12} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={12} stroke="var(--color-muted-foreground)" tickFormatter={(v) => `${v/1000}k`} />
              <RTooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} formatter={(v: number) => formatDA(v)} />
              <Bar dataKey="revenus" fill="var(--color-primary)" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function TripsTab() {
  const [list, setList] = useState(tripsData);
  return (
    <Card>
      <CardHeader><CardTitle>Mes trajets publiés</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Trajet</TableHead><TableHead>Date</TableHead><TableHead>Heure</TableHead>
            <TableHead>Type</TableHead><TableHead>Places</TableHead><TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead><TableHead>GPS</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>{list.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.fromWilaya} → {t.toWilaya}</TableCell>
              <TableCell>{t.date}</TableCell><TableCell>{t.time}</TableCell>
              <TableCell>{t.transportType}</TableCell>
              <TableCell>{t.seatsTotal - t.seatsAvailable}/{t.seatsTotal}</TableCell>
              <TableCell>{formatDA(t.price)}</TableCell>
              <TableCell><StatusBadge status={t.status} /></TableCell>
              <TableCell><StatusBadge status={t.gpsStatus} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button size="sm" variant="outline" onClick={() => {
                    setList(xs => xs.map(x => x.id === t.id ? { ...x, status: "En cours" } : x));
                    toast.success("Trajet démarré");
                  }}>Démarrer</Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setList(xs => xs.map(x => x.id === t.id ? { ...x, gpsStatus: "Actif" } : x));
                    toast.success("GPS activé");
                  }}>Activer GPS</Button>
                </div>
              </TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ReservationsTab() {
  const [list, setList] = useState(reservationsData);
  return (
    <Card>
      <CardHeader><CardTitle>Réservations reçues</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Passager</TableHead><TableHead>Trajet</TableHead><TableHead>Siège</TableHead>
            <TableHead>Paiement</TableHead><TableHead>QR</TableHead><TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>{list.map((r) => {
            const trip = getTrip(r.tripId); const trav = getTraveler(r.travelerId);
            return (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{trav?.name}</TableCell>
                <TableCell>{trip?.fromWilaya} → {trip?.toWilaya}</TableCell>
                <TableCell>N° {r.seatNumber}</TableCell>
                <TableCell><StatusBadge status="Confirmée" /></TableCell>
                <TableCell>{r.qrScanned ? "Scanné" : "Non scanné"}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" onClick={() => { setList(xs => xs.map(x => x.id === r.id ? { ...x, status: "Confirmée" } : x)); toast.success("Réservation acceptée"); }}>Accepter</Button>
                    <Button size="sm" variant="outline" onClick={() => { setList(xs => xs.map(x => x.id === r.id ? { ...x, status: "Annulée" } : x)); toast.message("Réservation refusée"); }}>Refuser</Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}</TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PassengersTab() {
  const trip = tripsData[1];
  return (
    <Card>
      <CardHeader><CardTitle>Passagers · {trip.fromWilaya} → {trip.toWilaya}</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Nom</TableHead><TableHead>Téléphone</TableHead>
            <TableHead>Siège</TableHead><TableHead>Embarquement</TableHead><TableHead>QR</TableHead>
          </TableRow></TableHeader>
          <TableBody>{travelers.slice(0, 5).map((t, i) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.name}</TableCell>
              <TableCell>{t.phone}</TableCell>
              <TableCell>N° {i + 1}</TableCell>
              <TableCell><StatusBadge status={i % 2 === 0 ? "Confirmée" : "En attente"} /></TableCell>
              <TableCell>{i % 2 === 0 ? "Scanné" : "Non scanné"}</TableCell>
            </TableRow>))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ScanTab() {
  const [scanned, setScanned] = useState(false);
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Scanner un billet QR</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center gap-4 p-6">
          <div className="flex h-56 w-56 items-center justify-center rounded-2xl border-2 border-dashed border-primary bg-muted/30">
            <ScanLine className="h-20 w-20 text-primary/60" />
          </div>
          <Button size="lg" className="w-full font-semibold" onClick={() => { setScanned(true); toast.success("Billet vérifié avec succès"); }}>
            Simuler le scan QR
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Résultat du scan</CardTitle></CardHeader>
        <CardContent>
          {!scanned ? (
            <div className="rounded-lg border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
              Aucun billet scanné pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-success">
                <CheckCircle2 className="h-5 w-5" /> <span className="font-semibold">Billet vérifié avec succès</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Field label="Voyageur" value="Sara Meziane" />
                <Field label="Réservation" value="WG-2026-001" />
                <Field label="Trajet" value="Oran → Alger" />
                <Field label="Siège" value="N° 12" />
                <Field label="Paiement" value="Confirmé" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-muted/30 p-3"><div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div><div className="font-semibold">{value}</div></div>;
}

function EarningsTab() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Compte intermédiaire (bloqué)" value={formatDA(48000)} icon={Wallet} />
        <StatCard label="Montant libéré" value={formatDA(162000)} icon={CheckCircle2} />
        <StatCard label="Retraits en attente" value={formatDA(20000)} icon={TrendingUp} />
        <StatCard label="Paiements reçus" value={formatDA(248000)} icon={Wallet} />
      </div>
      <Card>
        <CardHeader><CardTitle>Historique des paiements</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Transaction</TableHead><TableHead>Trajet</TableHead>
              <TableHead>Montant</TableHead><TableHead>Méthode</TableHead><TableHead>Date</TableHead>
            </TableRow></TableHeader>
            <TableBody>{[1,2,3,4,5].map((i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs">TX-2026-010{i}</TableCell>
                <TableCell>Oran → Alger</TableCell>
                <TableCell>{formatDA(1320 + i * 150)}</TableCell>
                <TableCell>BaridiMob</TableCell>
                <TableCell>2026-05-1{i}</TableCell>
              </TableRow>))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[
        { name: "Sara Meziane", rating: 5, text: "Chauffeur ponctuel et très professionnel." },
        { name: "Lina Bouchareb", rating: 5, text: "Voyage agréable, véhicule propre." },
        { name: "Mohamed Khaled", rating: 4, text: "Bon trajet, conduite prudente." },
        { name: "Yasmine Haddad", rating: 5, text: "Je recommande vivement, merci !" },
      ].map((r, i) => (
        <Card key={i}><CardContent className="space-y-2 p-5">
          <div className="flex items-center justify-between"><div className="font-semibold">{r.name}</div>
            <div className="flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-primary text-primary" /> {r.rating}/5</div></div>
          <p className="text-sm text-muted-foreground">{r.text}</p>
        </CardContent></Card>))}
    </div>
  );
}

function NotificationsTab() {
  const items = [
    { t: "Nouvelle réservation", d: "Sara · Alger → Batna", time: "Il y a 5 minutes" },
    { t: "Paiement reçu", d: "1 320 DA via BaridiMob", time: "Il y a 12 minutes" },
    { t: "Avis reçu", d: "5 étoiles de Lina Bouchareb", time: "Aujourd'hui à 09:30" },
  ];
  return (
    <div className="space-y-3">{items.map((n, i) => (
      <Card key={i}><CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><Car className="h-5 w-5" /></div>
        <div className="flex-1"><div className="font-semibold">{n.t}</div><div className="text-sm text-muted-foreground">{n.d}</div></div>
        <div className="text-xs text-muted-foreground">{n.time}</div>
      </CardContent></Card>))}
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Profil</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Field label="Nom" value="Ahmed Benali" />
          <Field label="Téléphone" value="+213 555 12 34 56" />
          <Field label="Wilaya" value="Alger" />
        </CardContent></Card>
      <Card><CardHeader><CardTitle>Véhicule</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Field label="Marque" value="Hyundai Accent" />
          <Field label="Immatriculation" value="00123-116-16" />
          <Field label="Sièges" value="4" />
        </CardContent></Card>
    </div>
  );
}
