import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, QrCode, MapPin, Wallet, Star, Lock,
  CheckCircle2, Smartphone, Car, Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import landing_bg from "@/assets/landing_bg.png";

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
          <Link to="/help" className="text-muted-foreground hover:text-foreground">Aide</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Se connecter</Link>
          </Button>
          <Button asChild className="font-semibold">
            <Link to="/signup">Commencer</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden border-b min-h-[70vh]" style={{ backgroundImage: `url(${landing_bg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="mx-auto flex max-w-7xl gap-10 px-4 py-20 md:px-6 md:py-28 lg:grid-cols-2 lg:py-32 items-center justify-center">
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <h1 className="inline-block rounded-lg bg-background/50 backdrop-blur px-4 py-2 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Réservez vos trajets entre wilayas<span className="text-primary">facilement</span> et en toute <span className="text-primary">sécurité</span> 
          </h1>
          <p className="mt-5 inline-block rounded-lg bg-background/50 backdrop-blur px-4 py-2 max-w-xl text-base  md:text-lg">
            Wilaya Go vous permet de réserver une place en taxi ou en bus, payer en ligne et suivre votre trajet en temps réel
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs ">
            <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 backdrop-blur px-3 py-1"><CheckCircle2 className="h-4 w-4 text-success" /> 58 wilayas couvertes</div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-background/50 backdrop-blur px-3 py-1"><CheckCircle2 className="h-4 w-4 text-success" /> Paiement BaridiMob, CIB, Edahabia</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Registration() {
  return (
    <section className="relative border-b pt-24 pb-14 md:pb-20">
      <div className="absolute left-1/2 top-0 z-10 w-full max-w-7xl -translate-x-1/2 transform px-4 md:px-6">
        <div className="mx-auto -mt-12 grid w-full gap-6 md:grid-cols-2">
          <RegCard
            title="Inscription Voyageur"
            desc="Créez votre compte et réservez en quelques secondes vos trajets entre wilayas."
            cta="Devenir voyageur"
            icon={Users}
            dark
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
      <div className="mx-auto max-w-7xl md:px-6 " style={{ minHeight: 96 }} />
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
    { v: "12000+", l: "voyageurs", icon: Users },
    { v: "1500+", l: "chauffeurs", icon: Users },
    { v: "8500+", l: "trajets disponibles", icon: MapPin },
    { v: "2500+", l: "réservations", icon: Calendar },
    { v: "4.8/5", l: "satisfaction", icon: Star },
  ];
  return (
    <section className="border-b bg-foreground py-12 text-background">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-5 md:px-6">
        {items.map((s) => (
          <div key={s.l} className="flex items-center gap-4 text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg text-primary">
              <s.icon className="h-10 w-10" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary md:text-4xl">{s.v}</div>
              <div className="mt-1 text-sm text-background/70">{s.l}</div>
            </div>
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

function Footer() {
  return (
    <footer className="bg-foreground py-10 text-background">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center md:px-6">
        <div className="flex items-center gap-3">
          <Logo />
        </div>
        <div className="text-sm text-background/70">
          © 2026 WilayaGo - Tous droits réservés
        </div>
      </div>
    </footer>
  );
}
