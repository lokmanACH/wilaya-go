import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Car } from "lucide-react";
import logo_pic from "@/assets/logo_pic.png";
import logo_name from "@/assets/logo_name.png";

interface QRTicketProps {
  travelerName: string;
  reservationId: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seat: number;
  driverName: string;
  vehicle: string;
}

export function QRTicket(props: QRTicketProps) {
  return (
    <Card className="overflow-hidden border-2 border-dashed border-primary/40 print:border-solid">
      <div className="flex items-center justify-between bg-accent px-5 py-3 text-foreground">
        <div className="flex items-center gap-2">
          <img src={logo_pic} alt="Logo" className="h-8 w-8" />
          <img src={logo_name} alt="WilayaGo" className="h-6 w-auto" />
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest opacity-70">Billet électronique</div>
          <div className="text-sm font-bold">N° {props.reservationId}</div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Trajet</div>
              <div className="text-lg font-bold">
                {props.from} → {props.to}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <Field label="Date" value={props.date} />
            <Field label="Heure" value={props.time} />
            <Field label="Siège" value={`N° ${props.seat}`} highlight />
            <Field label="Voyageur" value={props.travelerName} />
            <Field label="Chauffeur" value={props.driverName} />
            <Field label="Véhicule" value={props.vehicle} />
          </div>

          <Badge variant="secondary" className="gap-1 bg-success/15 text-success">
            <CheckCircle2 className="h-3 w-3" /> Paiement confirmé
          </Badge>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative h-36 w-36 rounded-xl border-2 border-foreground bg-background p-2">
            <div className="fake-qr h-full w-full text-foreground" />
            <div className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-accent">
              <img src={logo_pic} alt="" />
            </div>
          </div>
          <div className="text-center text-[10px] uppercase tracking-widest text-muted-foreground">
            À présenter au chauffeur
          </div>
        </div>
      </div>

      <div className="border-t bg-muted/40 px-5 py-2 text-center text-[11px] text-muted-foreground">
        WilayaGo — Billet sécurisé · Vérifiez les informations avant le départ
      </div>
    </Card>
  );
}

function Field({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={highlight ? "font-bold text-primary" : "font-semibold"}>{value}</div>
    </div>
  );
}
