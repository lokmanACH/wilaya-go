import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { QRTicket } from "@/components/QRTicket";
import { Button } from "@/components/ui/button";
import { Download, MapPin, QrCode } from "lucide-react";
import { reservations, getTrip, getDriver } from "@/data/mock";

export const Route = createFileRoute("/traveler/ticket/$id")({
  head: () => ({ meta: [{ title: "Billet QR — Wilaya Go" }] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  const r = reservations.find(x => x.id === id) ?? reservations[0];
  const trip = getTrip(r.tripId)!;
  const driver = getDriver(trip.driverId)!;
  return (
    <DashboardLayout role="traveler" title="Billet QR">
      <div className="mx-auto max-w-2xl space-y-4">
        <QRTicket travelerName="Sara Meziane" reservationId={`WG-${r.id.toUpperCase()}`} from={trip.fromWilaya} to={trip.toWilaya} date={trip.date} time={trip.time} seat={r.seatNumber} driverName={driver.name} vehicle={`${driver.vehicleBrand} ${driver.vehicleModel}`} />
        <div className="flex flex-wrap gap-2">
          <Button className="flex-1 font-semibold" variant="outline"><Download className="mr-2 h-4 w-4" /> Télécharger le billet</Button>
          <Button className="flex-1 font-semibold" variant="outline"><QrCode className="mr-2 h-4 w-4" /> Afficher le QR</Button>
          <Button className="flex-1 font-semibold" asChild>
            <Link to="/tracking/$id" params={{ id: trip.id }}><MapPin className="mr-2 h-4 w-4" /> Suivre le trajet</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
