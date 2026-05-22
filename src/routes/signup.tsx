import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Inscription — Wilaya Go" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const { setRole } = useRole();
  const [mode, setMode] = useState<"driver" | "traveler">("driver");
  const [loading, setLoading] = useState(false);

  const go = (role: "admin" | "driver" | "traveler") => {
    setRole(role);
    toast.success("Inscription réussie", { description: "Bienvenue sur Wilaya Go" });
    const dest = role === "admin" ? "/admin" : role === "driver" ? "/driver" : "/traveler";
    nav({ to: dest });
  };

  const handleDriverSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    // minimal validation
    if (!data.get("fullName") || !data.get("phone") || !data.get("email") || !data.get("password")) {
      toast.error("Veuillez remplir les champs obligatoires");
      setLoading(false);
      return;
    }

    // TODO: send to API
    setTimeout(() => {
      setLoading(false);
      go("driver");
    }, 800);
  };

  const handleTravelerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!data.get("fullName") || !data.get("phone") || !data.get("email") || !data.get("password")) {
      toast.error("Veuillez remplir les champs obligatoires");
      setLoading(false);
      return;
    }

    // TODO: send to API
    setTimeout(() => {
      setLoading(false);
      go("traveler");
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button asChild size="icon" variant="ghost">
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <Logo />
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-4xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Inscription</h1>

        <div className="mb-6 flex gap-3">
          <button
            className={`px-4 py-2 rounded-md ${mode === "driver" ? "bg-primary text-white" : "bg-muted"}`}
            onClick={() => setMode("driver")}
          >
            Inscription Chauffeur
          </button>
          <button
            className={`px-4 py-2 rounded-md ${mode === "traveler" ? "bg-primary text-white" : "bg-muted"}`}
            onClick={() => setMode("traveler")}
          >
            Inscription Voyageur
          </button>
        </div>

        {mode === "driver" ? (
          <form onSubmit={handleDriverSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Nom et prénom *</span>
                <Input name="fullName" placeholder="Ex: Ahmed Ben Ali" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Numéro de téléphone *</span>
                <Input name="phone" type="tel" placeholder="+213 6 12 34 56 78" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Adresse email *</span>
                <Input name="email" type="email" placeholder="you@example.com" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Mot de passe *</span>
                <Input name="password" type="password" placeholder="••••••••" />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Scan du permis de conduire</span>
                <input name="licenseScan" type="file" accept="image/*,application/pdf" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Scan de la carte nationale</span>
                <input name="idScan" type="file" accept="image/*,application/pdf" />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Type de véhicule</span>
                <select name="vehicleType" className="rounded-md border p-2">
                  <option>Taxi</option>
                  <option>Bus / Car</option>
                </select>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Marque du véhicule</span>
                <Input name="vehicleBrand" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Numéro d'immatriculation (matricule)</span>
                <Input name="plateNumber" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Nombre de sièges</span>
                <Input name="seatCount" type="number" min={1} />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Numérotation des sièges</span>
              <Input name="seatNumbering" placeholder="Ex: 1-2-3 ..." />
            </label>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Compte bancaire / CCP / RIB</span>
                <Input name="bankAccount" placeholder="IBAN / RIB / CCP" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Moyens de paiement acceptés</span>
                <div className="flex gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="pay_cash" />
                    <span>Espèces</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="pay_card" />
                    <span>Carte</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" name="pay_mobile" />
                    <span>Mobile</span>
                  </label>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "S'inscrire"}
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleTravelerSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Nom et prénom *</span>
                <Input name="fullName" placeholder="Ex: Aicha B." />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Téléphone *</span>
                <Input name="phone" type="tel" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Email *</span>
                <Input name="email" type="email" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Mot de passe *</span>
                <Input name="password" type="password" />
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm">Scan carte nationale</span>
                <input name="idScan" type="file" accept="image/*,application/pdf" />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm">Compte bancaire / CCP</span>
                <Input name="bankAccount" />
              </label>
            </div>

            <label className="flex flex-col gap-1">
              <span className="text-sm">Moyens de paiement acceptés</span>
              <div className="flex gap-2">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="pay_cash" />
                  <span>Espèces</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="pay_card" />
                  <span>Carte</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" name="pay_mobile" />
                  <span>Mobile</span>
                </label>
              </div>
            </label>

            <div className="flex items-center justify-end gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Enregistrement..." : "S'inscrire"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}