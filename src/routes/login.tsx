import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Shield, Car, Users, UserCog, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-theme";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Wilaya Go" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const { setRole } = useRole();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const go = (role: "admin" | "driver" | "traveler") => {
    setRole(role);
    toast.success("Connexion réussie", { description: "Bienvenue sur Wilaya Go" });
    const dest = role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/traveler";
    nav({ to: dest });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <Link to="/"><Logo /></Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch gap-8 p-4 py-10 md:px-6 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Badge variant="secondary" className="mb-3">Connexion fictive</Badge>
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Choisissez votre rôle pour accéder au tableau de bord
          </h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Cette démo simule une connexion sans véritable authentification. Sélectionnez un espace pour explorer Wilaya Go.
          </p>

          <div className="mt-6 grid gap-3">
            <RoleCard icon={Users} title="Voyageur" desc="Réserver, payer, suivre vos trajets." onClick={() => go("traveler")} />
            <RoleCard icon={Car} title="Chauffeur" desc="Publier des trajets, scanner les billets QR, encaisser." onClick={() => go("driver")} />
            <RoleCard icon={UserCog} title="Administrateur" desc="Gérer la plateforme, valider les chauffeurs, surveiller les paiements." onClick={() => go("admin")} />
          </div>
        </div>

        <Card className="flex-1 border-2">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl font-bold">Connexion à votre compte</h2>
            <p className="text-sm text-muted-foreground">Saisissez votre numéro pour recevoir un code OTP.</p>

            <Tabs defaultValue="password" className="mt-5">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Mot de passe</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>
              <TabsContent value="password" className="space-y-3 pt-4">
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input placeholder="+213 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Mot de passe</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button className="w-full font-semibold" onClick={() => go("traveler")}>
                  Connexion
                </Button>
              </TabsContent>
              <TabsContent value="otp" className="space-y-3 pt-4">
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input placeholder="+213 ..." value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Code OTP fictif</Label>
                  <Input placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Smartphone className="h-3 w-3" /> Code envoyé par SMS (simulé)
                  </div>
                </div>
                <Button className="w-full font-semibold" onClick={() => go("traveler")}>
                  Connexion avec OTP
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-5 flex items-center gap-2 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              Vos identifiants ne sont jamais transmis dans cette démo.
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, onClick }: { icon: any; title: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <div className="font-bold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <Badge variant="secondary">Entrer</Badge>
    </button>
  );
}
