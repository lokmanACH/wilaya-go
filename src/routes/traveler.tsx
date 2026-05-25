import { createFileRoute, useSearch, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ticket, MapPin, Wallet, RefreshCcw, Star, Bell, Heart, Car, CheckCircle2 } from "lucide-react";
import { reservations, payments, refunds, notifications, drivers, formatDA, getTrip, getDriver } from "@/data/mock";
import { QRTicket } from "@/components/QRTicket";
import { useState, useRef, useEffect } from "react";

const tabs = ["overview","reservations","tickets","tracking","payments","refunds","reviews","notifications","favorites","settings"] as const;
type Tab = typeof tabs[number];

export const Route = createFileRoute("/traveler")({
  validateSearch: z.object({
    tab: z.enum(tabs).optional(),
    highlight: z.string().optional(), 
  }),
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
      {tab === "overview"      && <Overview />}
      {tab === "reservations"  && <Reservations />}
      {tab === "tickets"       && <Tickets highlight={search.highlight} />}  {/* ← pass it */}
      {tab === "tracking"      && <Tracking />}
      {tab === "payments"      && <Payments />}
      {tab === "refunds"       && <Refunds />}
      {tab === "reviews"       && <Reviews />}
      {tab === "notifications" && <Notifications />}
      {tab === "favorites"     && <Favorites />}
      {tab === "settings"      && <Settings />}
    </DashboardLayout>
  );
}

function Overview() {
  const [step, setStep] = useState(1);
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<"Bus" | "Taxi" | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const wilayas = ["Constantine", "Sétif", "Skikda", "Khenchla", "El Eulma", "Mila", "Batna"];

const stationsByWilaya: Record<string, string[]> = {
  Constantine: ["Gare Routière Centrale", "Station Ben Badis", "Station Ain El Bey"],
  Sétif: ["Gare Routière Sétif", "Station El Hidhab", "Station Bab El Gharbi"],
  Skikda: ["Gare Routière Skikda", "Station Port", "Station Azzaba"],
  Khenchla: ["Gare Routière Khenchla", "Station Baghai"],
  "El Eulma": ["Gare Routière El Eulma", "Station Centre"],
  Mila: ["Gare Routière Mila", "Station Ferdjioua"],
  Batna: ["Gare Routière Batna", "Station Arris", "Station Tazoult"],
};

const stationTrips: Record<string, Record<string, {
  id: string; from: string; to: string; dep: string; date: string;
  driver: string; vehicle: string; rating: number; seats: number;
  price: number; type: "Bus" | "Taxi";
}[]>> = {
  Constantine: {
    "Gare Routière Centrale": [
      { id:"ct-gc-1", from:"Constantine", to:"Alger",    dep:"06:00", date:"2026-05-24", driver:"Karim Mansouri",  vehicle:"Mercedes Tourismo", rating:4.8, seats:12, price:1200, type:"Bus"  },
      { id:"ct-gc-2", from:"Constantine", to:"Mila",     dep:"08:30", date:"2026-05-24", driver:"Moussa Benaissa", vehicle:"Karosa LC936",       rating:4.5, seats:3,  price:1450, type:"Bus"  },
      { id:"ct-gc-3", from:"Constantine", to:"Annaba",   dep:"10:00", date:"2026-05-24", driver:"Bilal Chaouch",   vehicle:"Peugeot 301",        rating:4.9, seats:2,  price:800,  type:"Taxi" },
      { id:"ct-gc-4", from:"Constantine", to:"Sétif",    dep:"13:00", date:"2026-05-24", driver:"Adel Ziane",      vehicle:"Renault Logan",       rating:4.6, seats:4,  price:600,  type:"Taxi" },
      { id:"ct-gc-5", from:"Constantine", to:"Batna",    dep:"15:30", date:"2026-05-24", driver:"Sofiane Rezgui",  vehicle:"Yutong ZK6122",      rating:4.3, seats:9,  price:700,  type:"Bus"  },
    ],
    "Station Ben Badis": [
      { id:"ct-bb-1", from:"Constantine", to:"Alger",    dep:"07:15", date:"2026-05-24", driver:"Yacine Ferhat",   vehicle:"Yutong ZK6122",      rating:4.7, seats:8,  price:1200, type:"Bus"  },
      { id:"ct-bb-2", from:"Constantine", to:"Jijel",    dep:"09:00", date:"2026-05-24", driver:"Hamza Djellab",   vehicle:"Mercedes Tourismo",  rating:4.9, seats:5,  price:900,  type:"Bus"  },
      { id:"ct-bb-3", from:"Constantine", to:"Skikda",   dep:"11:30", date:"2026-05-24", driver:"Riad Amara",      vehicle:"Toyota Corolla",      rating:4.4, seats:3,  price:550,  type:"Taxi" },
    ],
    "Station Ain El Bey": [
      { id:"ct-ab-1", from:"Constantine", to:"Alger",    dep:"05:30", date:"2026-05-24", driver:"Nabil Chouikhi",  vehicle:"Karosa LC936",        rating:4.6, seats:14, price:1200, type:"Bus"  },
      { id:"ct-ab-2", from:"Constantine", to:"Mila",     dep:"08:00", date:"2026-05-24", driver:"Walid Hadjadj",   vehicle:"Dacia Duster",        rating:4.7, seats:4,  price:450,  type:"Taxi" },
      { id:"ct-ab-3", from:"Constantine", to:"Mila",     dep:"14:00", date:"2026-05-24", driver:"Omar Tebbal",     vehicle:"Mercedes Tourismo",   rating:4.8, seats:7,  price:1450, type:"Bus"  },
    ],
  },

  Sétif: {
    "Gare Routière Sétif": [
      { id:"sf-gr-1", from:"Sétif", to:"Alger",         dep:"06:00", date:"2026-05-24", driver:"Hicham Touati",   vehicle:"Dacia Duster",        rating:4.8, seats:3,  price:1100, type:"Taxi" },
      { id:"sf-gr-2", from:"Sétif", to:"Constantine",   dep:"09:15", date:"2026-05-24", driver:"Hamza Djellab",   vehicle:"Mercedes Tourismo",   rating:4.9, seats:15, price:650,  type:"Bus"  },
      { id:"sf-gr-3", from:"Sétif", to:"Béjaïa",        dep:"11:00", date:"2026-05-24", driver:"Farouk Khelifi",  vehicle:"Peugeot 308",         rating:4.7, seats:4,  price:700,  type:"Taxi" },
      { id:"sf-gr-4", from:"Sétif", to:"Alger",         dep:"14:30", date:"2026-05-24", driver:"Yacine Ferhat",   vehicle:"Yutong ZK6122",       rating:4.7, seats:10, price:1100, type:"Bus"  },
    ],
    "Station El Hidhab": [
      { id:"sf-eh-1", from:"Sétif", to:"Alger",         dep:"07:00", date:"2026-05-24", driver:"Karim Mansouri",  vehicle:"Mercedes Tourismo",   rating:4.8, seats:6,  price:1100, type:"Bus"  },
      { id:"sf-eh-2", from:"Sétif", to:"El Eulma",      dep:"10:00", date:"2026-05-24", driver:"Walid Hadjadj",   vehicle:"Renault Logan",        rating:4.5, seats:4,  price:300,  type:"Taxi" },
      { id:"sf-eh-3", from:"Sétif", to:"Jijel",         dep:"13:30", date:"2026-05-24", driver:"Bilal Chaouch",   vehicle:"Karosa LC936",        rating:4.6, seats:11, price:850,  type:"Bus"  },
    ],
    "Station Bab El Gharbi": [
      { id:"sf-bg-1", from:"Sétif", to:"Batna",         dep:"08:00", date:"2026-05-24", driver:"Adel Ziane",      vehicle:"Toyota Corolla",      rating:4.6, seats:2,  price:750,  type:"Taxi" },
      { id:"sf-bg-2", from:"Sétif", to:"Alger",         dep:"10:30", date:"2026-05-24", driver:"Sofiane Rezgui",  vehicle:"Yutong ZK6122",       rating:4.4, seats:8,  price:1100, type:"Bus"  },
      { id:"sf-bg-3", from:"Sétif", to:"Constantine",   dep:"16:00", date:"2026-05-24", driver:"Omar Tebbal",     vehicle:"Mercedes Tourismo",   rating:4.8, seats:13, price:650,  type:"Bus"  },
    ],
  },

  Skikda: {
    "Gare Routière Skikda": [
      { id:"sk-gr-1", from:"Skikda", to:"Annaba",       dep:"07:00", date:"2026-05-24", driver:"Riad Amara",      vehicle:"Karosa LC936",        rating:4.4, seats:5,  price:800,  type:"Bus"  },
      { id:"sk-gr-2", from:"Skikda", to:"Constantine",  dep:"09:30", date:"2026-05-24", driver:"Mehdi Saadi",     vehicle:"Toyota Corolla",      rating:4.5, seats:4,  price:1100, type:"Taxi" },
      { id:"sk-gr-3", from:"Skikda", to:"Alger",        dep:"05:00", date:"2026-05-24", driver:"Nabil Chouikhi",  vehicle:"Yutong ZK6122",       rating:4.6, seats:9,  price:1500, type:"Bus"  },
    ],
    "Station Port": [
      { id:"sk-pt-1", from:"Skikda", to:"Annaba",       dep:"08:00", date:"2026-05-24", driver:"Moussa Benaissa", vehicle:"Peugeot 301",         rating:4.7, seats:3,  price:800,  type:"Taxi" },
      { id:"sk-pt-2", from:"Skikda", to:"Jijel",        dep:"11:00", date:"2026-05-24", driver:"Hamza Djellab",   vehicle:"Karosa LC936",        rating:4.8, seats:12, price:600,  type:"Bus"  },
      { id:"sk-pt-3", from:"Skikda", to:"Constantine",  dep:"14:00", date:"2026-05-24", driver:"Bilal Chaouch",   vehicle:"Dacia Duster",        rating:4.9, seats:2,  price:1100, type:"Taxi" },
    ],
    "Station Azzaba": [
      { id:"sk-az-1", from:"Skikda", to:"Constantine",  dep:"06:30", date:"2026-05-24", driver:"Yacine Ferhat",   vehicle:"Mercedes Tourismo",   rating:4.7, seats:7,  price:1100, type:"Bus"  },
      { id:"sk-az-2", from:"Skikda", to:"Alger",        dep:"10:00", date:"2026-05-24", driver:"Farouk Khelifi",  vehicle:"Yutong ZK6122",       rating:4.6, seats:6,  price:1500, type:"Bus"  },
    ],
  },

  Khenchla: {
    "Gare Routière Khenchla": [
      { id:"kh-gr-1", from:"Khenchla", to:"Alger",      dep:"05:30", date:"2026-05-24", driver:"Nabil Chouikhi",  vehicle:"Yutong ZK6122",       rating:4.6, seats:9,  price:1600, type:"Bus"  },
      { id:"kh-gr-2", from:"Khenchla", to:"Batna",      dep:"08:00", date:"2026-05-24", driver:"Adel Ziane",      vehicle:"Renault Logan",        rating:4.5, seats:4,  price:500,  type:"Taxi" },
      { id:"kh-gr-3", from:"Khenchla", to:"Constantine",dep:"10:30", date:"2026-05-24", driver:"Omar Tebbal",     vehicle:"Mercedes Tourismo",   rating:4.8, seats:11, price:1200, type:"Bus"  },
    ],
    "Station Baghai": [
      { id:"kh-bg-1", from:"Khenchla", to:"Alger",      dep:"06:00", date:"2026-05-24", driver:"Sofiane Rezgui",  vehicle:"Karosa LC936",        rating:4.3, seats:14, price:1600, type:"Bus"  },
      { id:"kh-bg-2", from:"Khenchla", to:"Batna",      dep:"09:00", date:"2026-05-24", driver:"Walid Hadjadj",   vehicle:"Toyota Corolla",      rating:4.7, seats:3,  price:500,  type:"Taxi" },
    ],
  },

  "El Eulma": {
    "Gare Routière El Eulma": [
      { id:"eu-gr-1", from:"El Eulma", to:"Sétif",      dep:"07:00", date:"2026-05-24", driver:"Hicham Touati",   vehicle:"Renault Logan",        rating:4.8, seats:4,  price:300,  type:"Taxi" },
      { id:"eu-gr-2", from:"El Eulma", to:"Alger",      dep:"09:00", date:"2026-05-24", driver:"Karim Mansouri",  vehicle:"Yutong ZK6122",       rating:4.7, seats:8,  price:1200, type:"Bus"  },
      { id:"eu-gr-3", from:"El Eulma", to:"Constantine",dep:"12:00", date:"2026-05-24", driver:"Riad Amara",      vehicle:"Mercedes Tourismo",   rating:4.5, seats:6,  price:900,  type:"Bus"  },
    ],
    "Station Centre": [
      { id:"eu-sc-1", from:"El Eulma", to:"Sétif",      dep:"11:30", date:"2026-05-24", driver:"Walid Hadjadj",   vehicle:"Yutong ZK6122",       rating:4.7, seats:6,  price:300,  type:"Bus"  },
      { id:"eu-sc-2", from:"El Eulma", to:"Alger",      dep:"14:00", date:"2026-05-24", driver:"Farouk Khelifi",  vehicle:"Peugeot 308",         rating:4.6, seats:3,  price:1200, type:"Taxi" },
      { id:"eu-sc-3", from:"El Eulma", to:"Béjaïa",     dep:"08:30", date:"2026-05-24", driver:"Bilal Chaouch",   vehicle:"Karosa LC936",        rating:4.9, seats:10, price:750,  type:"Bus"  },
    ],
  },

  Mila: {
    "Gare Routière Mila": [
      { id:"ml-gr-1", from:"Mila", to:"Constantine",    dep:"07:00", date:"2026-05-24", driver:"Sofiane Rezgui",  vehicle:"Karosa LC936",        rating:4.3, seats:11, price:550,  type:"Bus"  },
      { id:"ml-gr-2", from:"Mila", to:"Alger",          dep:"05:30", date:"2026-05-24", driver:"Moussa Benaissa", vehicle:"Yutong ZK6122",       rating:4.5, seats:8,  price:1400, type:"Bus"  },
      { id:"ml-gr-3", from:"Mila", to:"Jijel",          dep:"10:00", date:"2026-05-24", driver:"Adel Ziane",      vehicle:"Dacia Duster",        rating:4.6, seats:4,  price:600,  type:"Taxi" },
    ],
    "Station Ferdjioua": [
      { id:"ml-fj-1", from:"Mila", to:"Constantine",    dep:"09:00", date:"2026-05-24", driver:"Hamza Djellab",   vehicle:"Mercedes Tourismo",   rating:4.9, seats:7,  price:550,  type:"Bus"  },
      { id:"ml-fj-2", from:"Mila", to:"Sétif",          dep:"11:00", date:"2026-05-24", driver:"Nabil Chouikhi",  vehicle:"Renault Logan",        rating:4.4, seats:3,  price:650,  type:"Taxi" },
    ],
  },

  Batna: {
    "Gare Routière Batna": [
      { id:"bt-gr-1", from:"Batna", to:"Alger",         dep:"06:45", date:"2026-05-24", driver:"Omar Tebbal",     vehicle:"Mercedes Tourismo",   rating:4.8, seats:2,  price:1300, type:"Bus"  },
      { id:"bt-gr-2", from:"Batna", to:"Constantine",   dep:"08:30", date:"2026-05-24", driver:"Yacine Ferhat",   vehicle:"Yutong ZK6122",       rating:4.7, seats:6,  price:700,  type:"Bus"  },
      { id:"bt-gr-3", from:"Batna", to:"Alger",         dep:"07:30", date:"2026-05-24", driver:"Farouk Khelifi",  vehicle:"Peugeot 308",         rating:4.7, seats:3,  price:1300, type:"Taxi" },
      { id:"bt-gr-4", from:"Batna", to:"Sétif",         dep:"11:00", date:"2026-05-24", driver:"Bilal Chaouch",   vehicle:"Karosa LC936",        rating:4.6, seats:9,  price:750,  type:"Bus"  },
    ],
    "Station Arris": [
      { id:"bt-ar-1", from:"Batna", to:"Alger",         dep:"05:00", date:"2026-05-24", driver:"Riad Amara",      vehicle:"Karosa LC936",        rating:4.4, seats:14, price:1300, type:"Bus"  },
      { id:"bt-ar-2", from:"Batna", to:"Khenchla",      dep:"09:00", date:"2026-05-24", driver:"Mehdi Saadi",     vehicle:"Toyota Corolla",      rating:4.5, seats:4,  price:500,  type:"Taxi" },
      { id:"bt-ar-3", from:"Batna", to:"Biskra",        dep:"12:00", date:"2026-05-24", driver:"Sofiane Rezgui",  vehicle:"Renault Logan",        rating:4.3, seats:3,  price:600,  type:"Taxi" },
    ],
    "Station Tazoult": [
      { id:"bt-tz-1", from:"Batna", to:"Alger",         dep:"06:00", date:"2026-05-24", driver:"Walid Hadjadj",   vehicle:"Yutong ZK6122",       rating:4.7, seats:10, price:1300, type:"Bus"  },
      { id:"bt-tz-2", from:"Batna", to:"Constantine",   dep:"10:00", date:"2026-05-24", driver:"Karim Mansouri",  vehicle:"Mercedes Tourismo",   rating:4.8, seats:5,  price:700,  type:"Bus"  },
      { id:"bt-tz-3", from:"Batna", to:"Sétif",         dep:"13:30", date:"2026-05-24", driver:"Hicham Touati",   vehicle:"Dacia Duster",        rating:4.9, seats:2,  price:750,  type:"Taxi" },
    ],
  },
};

// replace the availableTrips line with:
const availableTrips =
  selectedWilaya && selectedStation
    ? (stationTrips[selectedWilaya]?.[selectedStation] ?? []).filter(
        (t) => !selectedType || t.type === selectedType
      )
    : [];

  const totalSeats = selectedType === "Bus" ? 32 : 6;
  const takenSeats = selectedTrip
    ? Array.from({ length: totalSeats - (selectedTrip.availableSeats ?? 8) }, () =>
        Math.floor(Math.random() * totalSeats) + 1
      ).filter((v, i, a) => a.indexOf(v) === i)
    : [];

  const stepLabels = [
    { label: "Wilaya", icon: MapPin },
    { label: "Station", icon: MapPin },
    { label: "Véhicule", icon: Car },
    { label: "Trajet", icon: Ticket },
    { label: "Siège", icon: Ticket },
    { label: "Paiement", icon: Wallet },
  ];

  const goStep = (n: number) => setStep(n);

  const reset = () => {
    setStep(1); setSelectedWilaya(null); setSelectedStation(null);
    setSelectedType(null); setSelectedTrip(null); setSelectedSeat(null); setConfirmed(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Trajets passés" value="14" icon={CheckCircle2} />
        <Stat label="Paiements totaux" value={formatDA(48200)} icon={Wallet} />
        <Stat label="Remboursements" value={formatDA(2500)} icon={RefreshCcw} />
        <Stat label="Chauffeurs favoris" value="3" icon={Heart} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trajets disponibles</CardTitle>

          {/* Stepper pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {stepLabels.map((s, i) => {
              const n = i + 1;
              const isActive = step === n;
              const isDone = step > n;
              return (
                <div key={n} className="flex items-center gap-2">
                  <span
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all
                      ${isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-muted text-muted-foreground" : "border text-muted-foreground"}`}
                  >
                    {isDone ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <s.icon className="h-3 w-3" />}
                    {s.label}
                  </span>
                  {i < stepLabels.length - 1 && (
                    <span className="text-muted-foreground text-xs">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* Step 1 — Wilaya */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Choisir la wilaya de départ</p>
              <div className="flex flex-wrap gap-2">
                {wilayas.map((w) => (
                  <Button key={w} variant={selectedWilaya === w ? "default" : "outline"} size="sm"
                    onClick={() => { setSelectedWilaya(w); setSelectedStation(null); setStep(2); }}>
                    {w}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Station */}
          {step === 2 && selectedWilaya && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goStep(1)}>
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Retour
                </Button>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  Stations à {selectedWilaya}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {stationsByWilaya[selectedWilaya].map((s) => (
                  <Button key={s} variant={selectedStation === s ? "default" : "outline"} size="sm"
                    onClick={() => { setSelectedStation(s); setStep(3); }}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Vehicle type */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goStep(2)}>
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Retour
                </Button>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Type de véhicule</p>
              </div>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                {(["Bus", "Taxi"] as const).map((type) => (
                  <button key={type}
                    onClick={() => { setSelectedType(type); setStep(4); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all cursor-pointer
                      ${selectedType === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                    <Car className="h-7 w-7 text-primary" />
                    <span className="font-semibold text-sm">{type}</span>
                    <span className="text-xs text-muted-foreground">
                      {type === "Bus" ? "Grandes lignes · économique" : "Rapide · confort"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Trip list */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goStep(3)}>
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Retour
                </Button>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  {availableTrips.length} trajet(s) depuis {selectedWilaya}
                </p>
              </div>
              {availableTrips.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun trajet disponible.</p>
              ) : (
                <div className="space-y-2">
                  {availableTrips.map((t) => {
                    const low = t.seats <= 3;
                    return (
                      <div key={t.id}
                        onClick={() => { setSelectedTrip(t); setSelectedSeat(null); setStep(5); }}
                        className={`flex items-center justify-between gap-4 rounded-lg border p-4 cursor-pointer transition-colors hover:border-primary hover:bg-muted/40
                          ${selectedTrip?.id === t.id ? "border-primary bg-primary/5" : ""}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{t.from} → {t.to}</span>
                            <Badge variant="outline" className="text-xs">{t.type}</Badge>
                            <Badge variant="secondary"
                              className={low ? "bg-destructive/15 text-destructive text-xs" : "bg-success/15 text-success text-xs"}>
                              {t.seats} place{t.seats !== 1 ? "s" : ""}
                            </Badge>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Ticket className="h-3.5 w-3.5" />{t.date} · {t.dep}</span>
                            <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{t.driver} — {t.vehicle}</span>
                            <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{t.rating}</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-lg font-bold">{formatDA(t.price)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 5 — Seat */}
          {step === 5 && selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goStep(4)}>
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Retour
                </Button>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Choisir votre siège</p>
              </div>
              <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(4, 2.5rem)" }}>
                {Array.from({ length: totalSeats }, (_, i) => i + 1).map((n) => {
                  const taken = takenSeats.includes(n);
                  const sel = selectedSeat === n;
                  return (
                    <button key={n} disabled={taken}
                      onClick={() => setSelectedSeat(n)}
                      className={`h-10 w-10 rounded-lg text-xs font-medium border transition-all
                        ${taken ? "opacity-30 cursor-not-allowed bg-muted" :
                          sel ? "bg-primary text-primary-foreground border-primary" :
                          "hover:border-primary hover:text-primary"}`}>
                      {n}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span><span className="inline-block w-3 h-3 rounded-sm bg-primary mr-1 align-middle" />Sélectionné</span>
                <span><span className="inline-block w-3 h-3 rounded-sm bg-muted border mr-1 align-middle opacity-30" />Occupé</span>
              </div>
              <Button disabled={!selectedSeat} onClick={() => setStep(6)} className="mt-2">
                Confirmer le siège <Ticket className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 6 — Payment summary */}
          {step === 6 && selectedTrip && !confirmed && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => goStep(5)}>
                  <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Retour
                </Button>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Récapitulatif &amp; paiement</p>
              </div>
              <div className="rounded-lg border divide-y text-sm">
                {[
                  ["Trajet",    `${selectedTrip.from} → ${selectedTrip.to}`],
                  ["Départ",   `${selectedTrip.date} · ${selectedTrip.dep}`],
                  ["Siège",    `N° ${selectedSeat}`],
                  ["Véhicule", selectedTrip.vehicle],
                  ["Chauffeur",selectedTrip.driver],
                ].map(([k, v]) => (                  
                  <div key={k} className="flex justify-between px-4 py-3">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>))}
                <div className="flex justify-between px-4 py-3 font-bold text-base">
                  <span>Total</span><span>{formatDA(selectedTrip.price)}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setConfirmed(true)}>
                <Wallet className="mr-2 h-4 w-4" /> Payer &amp; confirmer
              </Button>
            </div>
          )}

          {/* Confirmed ticket */}
          {confirmed && selectedTrip && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Réservation confirmée</span>
              </div>
                <QRTicket
                  travelerName="Sara Meziane"
                  reservationId={`WG-R${Math.floor(Math.random() * 900 + 100)}`}
                  from={selectedTrip.from}
                  to={selectedTrip.to}
                  date={selectedTrip.date}
                  time={selectedTrip.dep}
                  seat={selectedSeat!}
                  driverName={selectedTrip.driver}
                  vehicle={selectedTrip.vehicle}
                />
              <Button variant="outline" onClick={reset} className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" /> Nouveau trajet
              </Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

function Reservations() {
  const navigate = useNavigate();

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
              <Button size="sm" variant="outline"
                onClick={() => navigate({ to: "/traveler", search: { tab: "tickets", highlight: r.id } })}>
                Voir billet
              </Button>
              <Button size="sm" asChild><Link to="/tracking/$id" params={{ id: t.id }}>Suivre</Link></Button>
            </div></TableCell>
          </TableRow>); })}
        </TableBody>
      </Table></CardContent>
    </Card>
  );
}

function Tickets({ highlight }: { highlight?: string }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlight && refs.current[highlight]) {
      refs.current[highlight]!.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlight]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {reservations.slice(0, 4).map((r) => {
        const t = getTrip(r.tripId)!;
        const d = getDriver(t.driverId)!;
        const isHighlighted = highlight === r.id;
        return (
          <div
            key={r.id}
            ref={el => { refs.current[r.id] = el; }}
            className={`rounded-xl transition-all duration-500 ${
              isHighlighted
                ? "ring-2 ring-primary ring-offset-2 shadow-md"
                : ""
            }`}
          >
            <QRTicket
              travelerName="Sara Meziane"
              reservationId={`WG-${r.id.toUpperCase()}`}
              from={t.fromWilaya}
              to={t.toWilaya}
              date={t.date}
              time={t.time}
              seat={r.seatNumber}
              driverName={d.name}
              vehicle={`${d.vehicleBrand} ${d.vehicleModel}`}
            />
          </div>
        );
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
  const wilayas = [
    "Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar",
    "Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger",
    "Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma",
    "Constantine","Médéa","Mostaganem","M'Sila","Mascara","Ouargla","Mila","El Bayadh",
    "Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt",
    "El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma",
    "Aïn Témouchent","Ghardaïa","Relizane",
  ];

  const [form, setForm] = useState({
    nom: "Sara Meziane",
    telephone: "+213 555 90 12 34",
    email: "sara.m@gmail.com",
    wilaya: "Alger",
    otp: true,
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(form);
  const [saved, setSaved] = useState(false);

  const startEdit = () => { setDraft(form); setEditing(true); setSaved(false); };
  const cancel = () => setEditing(false);
  const save = () => {
    setForm(draft);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Mon compte</CardTitle>
        {!editing ? (
          <Button size="sm" variant="outline" onClick={startEdit}>
            <Star className="mr-1.5 h-3.5 w-3.5" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={cancel}>Annuler</Button>
            <Button size="sm" onClick={save}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Enregistrer
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {saved && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <CheckCircle2 className="h-4 w-4" />
            Modifications enregistrées avec succès.
          </div>
        )}

        <div className="grid gap-3 text-sm sm:grid-cols-2">

          {/* Nom */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Nom</div>
            {editing ? (
              <input
                className="w-full rounded-md border bg-background px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                value={draft.nom}
                onChange={e => setDraft(d => ({ ...d, nom: e.target.value }))}
              />
            ) : (
              <div className="font-semibold">{form.nom}</div>
            )}
          </div>

          {/* Téléphone */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Téléphone</div>
            {editing ? (
              <input
                className="w-full rounded-md border bg-background px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                value={draft.telephone}
                onChange={e => setDraft(d => ({ ...d, telephone: e.target.value }))}
              />
            ) : (
              <div className="font-semibold">{form.telephone}</div>
            )}
          </div>

          {/* Email */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</div>
            {editing ? (
              <input
                type="email"
                className="w-full rounded-md border bg-background px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                value={draft.email}
                onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
              />
            ) : (
              <div className="font-semibold">{form.email}</div>
            )}
          </div>

          {/* Wilaya */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Wilaya</div>
            {editing ? (
              <select
                className="w-full rounded-md border bg-background px-2 py-1 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                value={draft.wilaya}
                onChange={e => setDraft(d => ({ ...d, wilaya: e.target.value }))}
              >
                {wilayas.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            ) : (
              <div className="font-semibold">{form.wilaya}</div>
            )}
          </div>

          {/* Compte — read-only */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Compte</div>
            <div className="flex items-center gap-1.5 font-semibold text-green-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Vérifié
            </div>
          </div>

        </div>

        {editing && (
          <p className="text-xs text-muted-foreground">
            Les modifications ne seront appliquées qu'après avoir cliqué sur <strong>Enregistrer</strong>.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
