import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Calendar as CalendarIcon } from "lucide-react";
import { wilayas } from "@/data/mock";

export function SearchCard({ compact = false }: { compact?: boolean }) {
  const nav = useNavigate();
  const [from, setFrom] = useState("Alger");
  const [to, setTo] = useState("Oran");
  const [date, setDate] = useState("2026-05-19");
  const [type, setType] = useState<"Taxi" | "Bus">("Bus");

  return (
    <Card className="border-2 shadow-2xl">
      <CardContent className={compact ? "p-4" : "p-6"}>
        <Tabs value={type} onValueChange={(v) => setType(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="Taxi">Taxi</TabsTrigger>
            <TabsTrigger value="Bus">Bus</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" /> Wilaya de départ
            </Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {wilayas.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              <MapPin className="mr-1 inline h-3 w-3" /> Wilaya d'arrivée
            </Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {wilayas.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              <CalendarIcon className="mr-1 inline h-3 w-3" /> Date du trajet
            </Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="flex items-end">
            <Button
              size="lg"
              className="w-full font-semibold"
              onClick={() =>
                nav({ to: "/traveler/search", search: { from, to, date, type } as any })
              }
            >
              <Search className="mr-2 h-4 w-4" /> Rechercher
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
