import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ShieldCheck, QrCode, MapPin, Wallet, Star, Lock,
  CheckCircle2, FileCheck, Smartphone, Bus, Car, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchCard } from "@/components/SearchCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wilaya Go — Réservez vos trajets entre wilayas" },
      { name: "description", content: "Wilaya Go vous permet de réserver une place en taxi ou en bus, payer en ligne, recevoir un billet QR et suivre votre trajet en temps réel." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Registration />
      <Features />
      <Stats />
      <HowItWorks />
      <Security />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/"><Logo /></Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#accueil" className="text-muted-foreground hover:text-foreground">Accueil</a>
          <a href="#fonctionnalites" className="text-muted-foreground hover:text-foreground">Fonctionnalités</a>
          <a href="#comment" className="text-muted-foreground hover:text-foreground">Comment ça marche</a>
          <a href="#securite" className="text-muted-foreground hover:text-foreground">Sécurité</a>
          <Link to="/help" className="text-muted-foreground hover:text-foreground">Aide</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Connexion</Link>
          </Button>
          <Button asChild className="font-semibold">
            <Link to="/login">Commencer</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,oklch(0.86_0.17_95/0.3),transparent_60%),radial-gradient(circle_at_80%_60%,oklch(0.86_0.17_95/0.18),transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <Badge variant="secondary" className="mb-4 gap-1 bg-primary/15 text-primary-foreground/90 hover:bg-primary/15">
            <ShieldCheck className="h-3 w-3" /> Plateforme algérienne · Paiement sécurisé
          </Badge>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Réservez vos trajets entre <span className="text-primary">wilayas</span> facilement et en toute sécurité.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Wilaya Go vous permet de réserver une place en taxi ou en bus, payer en ligne, recevoir un billet QR et suivre votre trajet en temps réel.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 font-semibold">
              <Link to="/traveler/search">Réserver un trajet <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 font-semibold">
              <Link to="/login">Devenir chauffeur</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> 48 wilayas couvertes</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Paiement BaridiMob, CIB, Edahabia</div>
            <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> Compte intermédiaire sécurisé</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-full bg-primary/30 blur-3xl md:block" />
          <SearchCard />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniBadge icon={Car} label="Taxi inter-wilaya" />
            <MiniBadge icon={Bus} label="Bus longue distance" />
            <MiniBadge icon={MapPin} label="Suivi GPS temps réel" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniBadge({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-xs font-medium">
      <Icon className="h-4 w-4 text-primary" /> {label}
    </div>
  );
}

function Registration() {
  return (
    <section className="border-b py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <RegCard
            title="Inscription Voyageur"
            desc="Créez votre compte et réservez en quelques secondes vos trajets entre wilayas."
            cta="Devenir voyageur"
            icon={Users}
          />
          <RegCard
            title="Inscription Chauffeur"
            desc="Publiez vos trajets, gérez vos passagers et recevez vos paiements en toute sécurité."
            cta="Devenir chauffeur"
            icon={Car}
            dark
          />
        </div>
      </div>
    </section>
  );
}

function RegCard({ title, desc, cta, icon: Icon, dark }: { title: string; desc: string; cta: string; icon: any; dark?: boolean }) {
  return (
    <Card className={dark ? "border-foreground bg-foreground text-background" : ""}>
      <CardContent className="flex flex-col gap-4 p-6 md:p-8">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${dark ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"}`}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className={dark ? "text-background/70" : "text-muted-foreground"}>{desc}</p>
        <Button asChild className={`mt-2 w-fit font-semibold ${dark ? "" : ""}`}>
          <Link to="/login">{cta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function Features() {
  const items = [
    { icon: QrCode, title: "Réservation rapide", desc: "Trouvez et réservez un siège en moins d'une minute." },
    { icon: Wallet, title: "Paiement électronique sécurisé", desc: "BaridiMob, CIB, Edahabia — vos paiements protégés." },
    { icon: Smartphone, title: "Billet QR instantané", desc: "Recevez votre billet électronique vérifié au scan." },
    { icon: MapPin, title: "Suivi GPS en temps réel", desc: "Suivez votre véhicule sur tout le trajet." },
    { icon: Lock, title: "Compte intermédiaire sécurisé", desc: "Vos paiements sont libérés après confirmation d'arrivée." },
    { icon: Star, title: "Avis et notes vérifiés", desc: "Choisissez vos chauffeurs en toute confiance." },
  ];
  return (
    <section id="fonctionnalites" className="border-b py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-3">Fonctionnalités</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Tout ce qu'il faut pour voyager sereinement</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.title} className="transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { v: "120 000+", l: "voyageurs" },
    { v: "15 000+", l: "chauffeurs" },
    { v: "8 500+", l: "trajets disponibles" },
    { v: "250 000+", l: "réservations" },
    { v: "4.8/5", l: "satisfaction" },
  ];
  return (
    <section className="border-b bg-foreground py-12 text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-5 md:px-6">
        {items.map((s) => (
          <div key={s.l} className="text-center">
            <div className="text-3xl font-extrabold text-primary md:text-4xl">{s.v}</div>
            <div className="mt-1 text-sm text-background/70">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    "Choisissez votre trajet",
    "Sélectionnez votre siège",
    "Payez en ligne",
    "Recevez votre billet QR",
    "Suivez votre trajet",
  ];
  return (
    <section id="comment" className="border-b py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-3">Comment ça marche</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">5 étapes simples</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <Card key={s} className="relative">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div className="font-semibold">{s}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Security() {
  const items = [
    { icon: Lock, title: "Paiement protégé", desc: "Compte intermédiaire jusqu'à confirmation d'arrivée." },
    { icon: Smartphone, title: "Vérification OTP", desc: "Code à usage unique sur votre téléphone." },
    { icon: FileCheck, title: "Documents vérifiés", desc: "Permis et carte d'identité contrôlés par l'équipe." },
    { icon: ShieldCheck, title: "Compte intermédiaire sécurisé", desc: "Aucun fonds n'est libéré sans votre confirmation." },
    { icon: MapPin, title: "Suivi GPS sécurisé", desc: "Position partagée uniquement durant le trajet." },
  ];
  return (
    <section id="securite" className="border-b py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 text-center">
          <Badge variant="secondary" className="mb-3">Sécurité</Badge>
          <h2 className="text-3xl font-bold md:text-4xl">Une plateforme conçue pour vous protéger</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.title}>
              <CardContent className="p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-success/15 text-success">
                  <it.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{it.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{it.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-foreground py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="text-sm text-background/70">
          © 2026 Wilaya Go — Plateforme algérienne de transport inter-wilayas
        </div>
        <div className="flex gap-4 text-sm text-background/70">
          <Link to="/help" className="hover:text-background">Aide</Link>
          <Link to="/login" className="hover:text-background">Connexion</Link>
        </div>
      </div>
    </footer>
  );
}
