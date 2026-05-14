import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Route = createFileRoute("/help")({
  head: () => ({ meta: [{ title: "Aide et assistant — Wilaya Go" }] }),
  component: HelpPage,
});

const SUGGESTIONS = [
  "Comment réserver un trajet ?",
  "Comment payer ma réservation ?",
  "Comment annuler une réservation ?",
  "Où trouver mon billet QR ?",
  "Comment suivre mon trajet ?",
  "J'ai un problème de paiement",
  "J'ai un problème de connexion",
];

const REPLIES: Record<string, string> = {
  "Comment réserver un trajet ?": "Allez dans « Rechercher un trajet », choisissez vos wilayas, la date et le type de transport. Sélectionnez ensuite un trajet, choisissez votre siège, puis procédez au paiement.",
  "Comment payer ma réservation ?": "Wilaya Go accepte BaridiMob, CIB et Edahabia. Le montant est conservé dans un compte intermédiaire sécurisé jusqu'à la confirmation d'arrivée.",
  "Comment annuler une réservation ?": "Ouvrez « Mes réservations », sélectionnez la réservation concernée et cliquez sur « Annuler ». Le remboursement est traité automatiquement si l'annulation a lieu avant le départ.",
  "Où trouver mon billet QR ?": "Vos billets sont disponibles dans « Mes billets QR ». Vous pouvez les afficher au chauffeur ou les télécharger.",
  "Comment suivre mon trajet ?": "Une fois le trajet démarré, ouvrez « Suivi GPS » pour voir la position du véhicule, l'heure d'arrivée estimée et les étapes du trajet.",
  "J'ai un problème de paiement": "Vérifiez votre solde et la méthode utilisée. Si le problème persiste, contactez notre support via cette messagerie en décrivant la transaction concernée.",
  "J'ai un problème de connexion": "Assurez-vous d'avoir saisi le bon numéro et le bon mot de passe. Vous pouvez aussi essayer la connexion par OTP depuis l'écran de connexion.",
};

type Msg = { role: "bot" | "user"; text: string };

function HelpPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Bonjour, je suis l'assistant Wilaya Go. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = REPLIES[q] ?? "Merci pour votre message. Un conseiller Wilaya Go vous répondra rapidement. En attendant, consultez les questions fréquentes ci-dessous.";
      setMessages((m) => [...m, { role: "bot", text: reply }]);
      setTyping(false);
    }, 800);
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

      <main className="mx-auto grid w-full max-w-5xl flex-1 gap-6 p-4 md:p-6 lg:grid-cols-[280px_1fr]">
        <Card className="h-fit">
          <CardContent className="p-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Questions fréquentes
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="rounded-lg border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
                >
                  {q}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex h-[70vh] flex-col">
          <div className="flex items-center gap-3 border-b p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold">Assistant Wilaya Go</div>
              <div className="text-xs text-success">● En ligne</div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "bot" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                      m.role === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-muted"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.role === "user" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "120ms" }} />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/60" style={{ animationDelay: "240ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </ScrollArea>

          <form
            className="flex gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <Input
              placeholder="Écrivez votre message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" className="font-semibold">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
