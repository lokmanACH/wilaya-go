import { createFileRoute, useSearch, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bus, Car, Users, Ticket, Wallet, RefreshCcw, MapPin,
  Star, CheckCircle2, XCircle, Eye, Pause, Trash2, Search,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  drivers as driversData, travelers as travelersData, payments as paymentsData,
  refunds as refundsData, reviews as reviewsData, trips as tripsData,
  monthlyRevenue, reservationsByWilaya, usersGrowth, transportSplit, peakHours,
  adminStats, formatDA, getDriver,
} from "@/data/mock";
import { toast } from "sonner";
import { MapMock } from "@/components/MapMock";

const tabs = [
  "overview", "drivers", "travelers", "reservations", "payments",
  "refunds", "tracking", "reports", "reviews", "stats", "settings",
] as const;
type Tab = (typeof tabs)[number];

export const Route = createFileRoute("/admin")({
  validateSearch: z.object({ tab: z.enum(tabs).optional() }),
  head: () => ({ meta: [{ title: "Administrateur — Wilaya Go" }] }),
  component: AdminPage,
});

const TAB_TITLES: Record<Tab, string> = {
  overview: "Vue d'ensemble", drivers: "Chauffeurs", travelers: "Voyageurs",
  reservations: "Réservations", payments: "Paiements", refunds: "Remboursements",
  tracking: "Trajets en cours", reports: "Signalements", reviews: "Avis",
  stats: "Statistiques", settings: "Paramètres",
};

function AdminPage() {
  const search = useSearch({ from: "/admin" });
  const tab: Tab = search.tab ?? "overview";

  return (
    <DashboardLayout role="admin" title={TAB_TITLES[tab]}>
      {tab === "overview" && <Overview />}
      {tab === "drivers" && <DriversTab />}
      {tab === "travelers" && <TravelersTab />}
      {tab === "reservations" && <ReservationsTab />}
      {tab === "refunds" && <RefundsTab />}
      {tab === "reports" && <ReportsTab />}
      {tab === "reviews" && <ReviewsTab />}
      {tab === "settings" && <SettingsTab />}
    </DashboardLayout>
  );
}

/* ---------- Overview ---------- */
function StatCard({ label, value, icon: Icon, trend, accent }: { label: string; value: string; icon: any; trend?: string; accent?: "primary" | "success" | "destructive" }) {
  const color = accent === "success" ? "text-success" : accent === "destructive" ? "text-destructive" : "text-primary";
  const bg = accent === "success" ? "bg-success/15" : accent === "destructive" ? "bg-destructive/15" : "bg-primary/15";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-extrabold">{value}</div>
            {trend && (
              <div className="mt-1 flex items-center gap-1 text-xs text-success">
                <ArrowUpRight className="h-3 w-3" /> {trend}
              </div>
            )}
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Overview() {
  const s = adminStats;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Voyageurs inscrits" value={s.voyageurs.toLocaleString("fr-FR")} icon={Users} trend="+8.2% ce mois" />
        <StatCard label="Chauffeurs inscrits" value={s.chauffeurs.toLocaleString("fr-FR")} icon={Car} trend="+4.1%" />
        <StatCard label="Taxis" value={s.taxis.toLocaleString("fr-FR")} icon={Car} accent="primary" />
        <StatCard label="Bus" value={s.bus.toLocaleString("fr-FR")} icon={Bus} accent="primary" />
        <StatCard label="Réservations totales" value={s.reservations.toLocaleString("fr-FR")} icon={Ticket} />
        <StatCard label="Trajets effectués" value={s.trajetsEffectues.toLocaleString("fr-FR")} icon={CheckCircle2} accent="success" />
        <StatCard label="Trajets annulés" value={s.trajetsAnnules.toLocaleString("fr-FR")} icon={XCircle} accent="destructive" />
        <StatCard label="Revenus de la plateforme" value={formatDA(s.revenus)} icon={Wallet} accent="success" />
        <StatCard label="Remboursements" value={formatDA(s.remboursements)} icon={RefreshCcw} accent="destructive" />
        <StatCard label="Paiements effectués" value={formatDA(s.paiements)} icon={Wallet} />
        <StatCard label="Trajets GPS actifs" value={s.trajetsGpsActifs.toString()} icon={MapPin} accent="success" />
        <StatCard label="Chauffeurs connectés" value={s.chauffeursConnectes.toLocaleString("fr-FR")} icon={Car} />
        <StatCard label="Voyageurs connectés" value={s.voyageursConnectes.toLocaleString("fr-FR")} icon={Users} />
        <StatCard label="Réservations du jour" value={s.reservationsJour.toLocaleString("fr-FR")} icon={Ticket} accent="primary" />
        <StatCard label="Paiements du jour" value={formatDA(s.paiementsJour)} icon={Wallet} accent="success" />
        <StatCard label="Taux de satisfaction" value="4.8 / 5" icon={Star} accent="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Revenus par mois (DA)">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mois" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
              <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => formatDA(v)} />
              <Area type="monotone" dataKey="revenus" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Réservations par wilaya">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={reservationsByWilaya}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="wilaya" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <RTooltip contentStyle={tooltipStyle} />
              <Bar dataKey="reservations" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Évolution des utilisateurs">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={usersGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="mois" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <RTooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="voyageurs" stroke="var(--color-primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="chauffeurs" stroke="var(--color-chart-3)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Utilisation Taxi vs Bus">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={transportSplit} dataKey="value" nameKey="name" outerRadius={90} label>
                <Cell fill="var(--color-primary)" />
                <Cell fill="var(--color-foreground)" />
              </Pie>
              <RTooltip contentStyle={tooltipStyle} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Heures de forte réservation">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="heure" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <RTooltip contentStyle={tooltipStyle} />
              <Bar dataKey="reservations" fill="var(--color-foreground)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Taux d'annulation et satisfaction">
          <div className="grid gap-4 p-2 sm:grid-cols-2">
            <MiniMetric label="Taux d'annulation" value="1.9%" trend="-0.4%" down />
            <MiniMetric label="Taux de satisfaction" value="96.2%" trend="+1.1%" />
            <MiniMetric label="Trajets les plus demandés" value="Alger → Oran" />
            <MiniMetric label="Note moyenne chauffeurs" value="4.7 / 5" />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  fontSize: 12,
};

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function MiniMetric({ label, value, trend, down }: { label: string; value: string; trend?: string; down?: boolean }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
      {trend && (
        <div className={`mt-1 flex items-center gap-1 text-xs ${down ? "text-success" : "text-success"}`}>
          {down ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />} {trend}
        </div>
      )}
    </div>
  );
}

/* ---------- Drivers ---------- */
function DriversTab() {
  const [list, setList] = useState(driversData);
  const [q, setQ] = useState("");
  const filtered = list.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));

  const update = (id: string, status: "Actif" | "Refusé") => {
    setList((xs) => xs.map((d) => (d.id === id ? { ...d, status, verified: status === "Actif" } : d)));
    toast.success(status === "Actif" ? "Chauffeur accepté avec succès" : "Chauffeur refusé");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Validations des chauffeurs</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Rechercher..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chauffeur</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8"><AvatarFallback>{d.name[0]}</AvatarFallback></Avatar>
                    <div>
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.transportType}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.vehicleBrand} {d.vehicleModel}</TableCell>
                <TableCell>{d.wilaya}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-success/15 text-success">Vérifiés</Badge>
                </TableCell>
                <TableCell>{d.joinedAt}</TableCell>
                <TableCell><StatusBadge status={d.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <DriverViewDialog id={d.id} />
                    <Button size="sm" variant="default" onClick={() => update(d.id, "Actif")}>
                      Accepter
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => update(d.id, "Refusé")}>
                      Refuser
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Actif: "bg-success/15 text-success",
    "En attente": "bg-warning/15 text-warning-foreground",
    Suspendu: "bg-destructive/15 text-destructive",
    Refusé: "bg-destructive/15 text-destructive",
    Disponible: "bg-success/15 text-success",
    "En cours": "bg-primary/15 text-primary",
    Terminé: "bg-muted text-muted-foreground",
    Annulé: "bg-destructive/15 text-destructive",
    Confirmée: "bg-success/15 text-success",
    Terminée: "bg-muted text-muted-foreground",
    Payé: "bg-success/15 text-success",
    Bloqué: "bg-warning/15 text-warning-foreground",
    Libéré: "bg-success/15 text-success",
    Remboursé: "bg-destructive/15 text-destructive",
    Effectué: "bg-success/15 text-success",
    Publié: "bg-success/15 text-success",
  };
  return <Badge variant="secondary" className={map[status] ?? ""}>{status}</Badge>;
}

function DriverViewDialog({ id }: { id: string }) {
  const d = getDriver(id)!;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du chauffeur</DialogTitle>
          <DialogDescription>{d.name} · {d.wilaya}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Téléphone" value={d.phone} />
          <Info label="Email" value={d.email} />
          <Info label="Véhicule" value={`${d.vehicleBrand} ${d.vehicleModel}`} />
          <Info label="Immatriculation" value={d.plate} />
          <Info label="Sièges" value={d.seats.toString()} />
          <Info label="Trajets effectués" value={d.trips.toString()} />
          <Info label="Note" value={`${d.rating} / 5`} />
          <Info label="Statut" value={d.status} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}

/* ---------- Travelers ---------- */
function TravelersTab() {
  const [list, setList] = useState(travelersData);
  const suspend = (id: string) => {
    setList((xs) => xs.map((t) => (t.id === id ? { ...t, status: "Suspendu" } : t)));
    toast.success("Utilisateur suspendu");
  };
  const remove = (id: string) => {
    setList((xs) => xs.filter((t) => t.id !== id));
    toast.success("Utilisateur supprimé");
  };
  return (
    <Card>
      <CardHeader><CardTitle>Gestion des utilisateurs</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead><TableHead>Rôle</TableHead>
              <TableHead>Téléphone</TableHead><TableHead>Email</TableHead>
              <TableHead>Statut</TableHead><TableHead>Activité</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>Voyageur</TableCell>
                <TableCell>{t.phone}</TableCell>
                <TableCell>{t.email}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
                <TableCell>{t.trips} trajets</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => suspend(t.id)}>
                      <Pause className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => remove(t.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- Reservations ---------- */
function ReservationsTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Toutes les réservations</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trajet</TableHead><TableHead>Type</TableHead>
              <TableHead>Date</TableHead><TableHead>Places réservées</TableHead>
              <TableHead>Prix</TableHead><TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tripsData.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.fromWilaya} → {t.toWilaya}</TableCell>
                <TableCell>{t.transportType}</TableCell>
                <TableCell>{t.date} · {t.time}</TableCell>
                <TableCell>{t.seatsTotal - t.seatsAvailable} / {t.seatsTotal}</TableCell>
                <TableCell>{formatDA(t.price)}</TableCell>
                <TableCell><StatusBadge status={t.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- Payments ---------- */
function PaymentsTab() {
  const [list, setList] = useState(paymentsData);
  const refund = (txId: string) => {
    setList((xs) => xs.map((p) => (p.transactionId === txId
      ? { ...p, status: "Remboursé", escrowStatus: "Remboursé" }
      : p)));
    toast.success("Remboursement effectué");
  };
  return (
    <Card>
      <CardHeader><CardTitle>Paiements et compte intermédiaire</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead><TableHead>Voyageur</TableHead>
              <TableHead>Chauffeur</TableHead><TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead><TableHead>Compte intermédiaire</TableHead>
              <TableHead>Statut</TableHead><TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((p) => (
              <TableRow key={p.transactionId}>
                <TableCell className="font-mono text-xs">{p.transactionId}</TableCell>
                <TableCell>{travelersData.find((t) => t.id === p.travelerId)?.name ?? "—"}</TableCell>
                <TableCell>{driversData.find((d) => d.id === p.driverId)?.name ?? "—"}</TableCell>
                <TableCell>{formatDA(p.total)}</TableCell>
                <TableCell>{p.method}</TableCell>
                <TableCell><StatusBadge status={p.escrowStatus} /></TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>{p.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-right">
                  <RefundDialog onConfirm={() => refund(p.transactionId)} disabled={p.status === "Remboursé"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RefundDialog({ onConfirm, disabled }: { onConfirm: () => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={disabled}>Rembourser</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer le remboursement</DialogTitle>
          <DialogDescription>Cette action est définitive et notifie le voyageur.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={() => { onConfirm(); setOpen(false); }}>Confirmer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Refunds ---------- */
function RefundsTab() {
  return (
    <Card>
      <CardHeader><CardTitle>Historique des remboursements</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead><TableHead>Voyageur</TableHead>
              <TableHead>Montant</TableHead><TableHead>Motif</TableHead>
              <TableHead>Date</TableHead><TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {refundsData.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.transactionId}</TableCell>
                <TableCell>{r.traveler}</TableCell>
                <TableCell>{formatDA(r.amount)}</TableCell>
                <TableCell>{r.reason}</TableCell>
                <TableCell>{r.date}</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- Tracking ---------- */
function TrackingTab() {
  const ongoing = tripsData.filter((t) => t.status === "En cours");
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <MapMock from="Oran" to="Alger" progress={62} eta="1h 45min" vehicleLabel="Bus · Mercedes Tourismo" />
      </div>
      <Card>
        <CardHeader><CardTitle>Trajets en cours</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {ongoing.length === 0 && (
            <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
              Aucun trajet en cours.
            </div>
          )}
          {ongoing.concat(tripsData.slice(0, 3)).slice(0, 4).map((t, i) => (
            <div key={t.id + i} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{t.fromWilaya} → {t.toWilaya}</div>
                <Badge variant="secondary" className="bg-success/15 text-success">GPS actif</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {t.transportType} · {getDriver(t.driverId)?.name} · ETA 1h 45min
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${t.progressPercentage || 40 + i * 10}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- Reports ---------- */
function ReportsTab() {
  const [list, setList] = useState(reviewsData);
  return (
    <Card>
      <CardHeader><CardTitle>Signalements et avis</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Signalé par</TableHead><TableHead>Concerné</TableHead>
              <TableHead>Type</TableHead><TableHead>Commentaire</TableHead>
              <TableHead>Note</TableHead><TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.from}</TableCell>
                <TableCell>{r.target}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell className="max-w-xs truncate">{r.comment}</TableCell>
                <TableCell>{r.rating} ★</TableCell>
                <TableCell><StatusBadge status={r.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="sm" variant="default" onClick={() => {
                      setList((xs) => xs.map((x) => x.id === r.id ? { ...x, status: "Publié" } : x));
                      toast.success("Signalement résolu");
                    }}>Résoudre</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.message("Signalement ignoré")}>
                      Ignorer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ---------- Reviews ---------- */
function ReviewsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {reviewsData.map((r) => (
        <Card key={r.id}>
          <CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{r.from}</div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-primary text-primary" /> {r.rating}/5
              </div>
            </div>
            <div className="text-xs text-muted-foreground">Sur {r.target} · {r.date}</div>
            <p className="text-sm">{r.comment}</p>
            <StatusBadge status={r.status} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------- Stats ---------- */
function StatsTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <ChartCard title="Revenus de la plateforme">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="mois" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
            <RTooltip contentStyle={tooltipStyle} formatter={(v: number) => formatDA(v)} />
            <Area type="monotone" dataKey="revenus" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Trajets les plus demandés">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={reservationsByWilaya} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis dataKey="wilaya" type="category" stroke="var(--color-muted-foreground)" fontSize={12} width={90} />
            <RTooltip contentStyle={tooltipStyle} />
            <Bar dataKey="reservations" fill="var(--color-primary)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

/* ---------- Settings ---------- */
function SettingsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Paramètres généraux</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Info label="Frais de plateforme" value="8 %" />
          <Info label="Délai de remboursement" value="48 heures" />
          <Info label="Vérification documents" value="Manuelle" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Sécurité</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Info label="Authentification OTP" value="Activée" />
          <Info label="Compte intermédiaire" value="Activé" />
          <Info label="Vérification anti-fraude" value="Activée" />
        </CardContent>
      </Card>
    </div>
  );
}
