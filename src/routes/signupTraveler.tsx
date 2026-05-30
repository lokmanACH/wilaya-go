import { createFileRoute, Link } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import logo_pic from "@/assets/logo_pic.png";
import logo_name from "@/assets/logo_name.png";

export const Route = createFileRoute("/signupTraveler")({
  head: () => ({ meta: [{ title: "Inscription — Wilaya Go" }] }),
  component: SignupPage,
});

function SignupPage() {
  const [loading, setLoading] = useState(false);

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

    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button asChild size="icon" variant="ghost">
            <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="hidden items-center gap-3 md:flex">
            <img src={logo_pic} alt="Logo" className="h-8 w-8" />
            <img src={logo_name} alt="Wilaya Go" className="h-6 w-auto" />
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="mx-auto w-full max-w-4xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Inscription Voyageur</h1>

          <form onSubmit={handleTravelerSubmit} className="space-y-4" id="traveler-form">
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
                <input 
                className="rounded-md border p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                name="idScan" type="file" accept="image/*,application/pdf" />
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
      </main>
    </div>
  );
}