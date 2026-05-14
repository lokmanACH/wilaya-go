import { Link, useRouterState } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import {
  Bell, LayoutDashboard, Users, Car, Wallet, RefreshCcw, MapPin,
  Flag, Star, BarChart3, Settings, Search, Ticket, QrCode, Calendar,
  HelpCircle, LogOut, Menu, ScanLine, TrendingUp, Heart, CreditCard,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: any };

const adminNav: NavItem[] = [
  { to: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: "/admin?tab=drivers", label: "Chauffeurs", icon: Car },
  { to: "/admin?tab=travelers", label: "Voyageurs", icon: Users },
  { to: "/admin?tab=reservations", label: "Réservations", icon: Ticket },
  { to: "/admin?tab=payments", label: "Paiements", icon: Wallet },
  { to: "/admin?tab=refunds", label: "Remboursements", icon: RefreshCcw },
  { to: "/admin?tab=tracking", label: "Trajets en cours", icon: MapPin },
  { to: "/admin?tab=reports", label: "Signalements", icon: Flag },
  { to: "/admin?tab=reviews", label: "Avis", icon: Star },
  { to: "/admin?tab=stats", label: "Statistiques", icon: BarChart3 },
  { to: "/admin?tab=settings", label: "Paramètres", icon: Settings },
];

const driverNav: NavItem[] = [
  { to: "/driver", label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: "/driver?tab=trips", label: "Mes trajets", icon: Car },
  { to: "/driver?tab=reservations", label: "Réservations", icon: Ticket },
  { to: "/driver?tab=passengers", label: "Passagers", icon: Users },
  { to: "/driver?tab=scan", label: "Scanner QR", icon: ScanLine },
  { to: "/driver?tab=earnings", label: "Revenus", icon: TrendingUp },
  { to: "/driver?tab=reviews", label: "Avis", icon: Star },
  { to: "/driver?tab=notifications", label: "Notifications", icon: Bell },
  { to: "/driver?tab=settings", label: "Paramètres", icon: Settings },
];

const travelerNav: NavItem[] = [
  { to: "/traveler", label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: "/traveler/search", label: "Rechercher un trajet", icon: Search },
  { to: "/traveler?tab=reservations", label: "Mes réservations", icon: Ticket },
  { to: "/traveler?tab=tickets", label: "Mes billets QR", icon: QrCode },
  { to: "/traveler?tab=tracking", label: "Suivi GPS", icon: MapPin },
  { to: "/traveler?tab=payments", label: "Paiements", icon: CreditCard },
  { to: "/traveler?tab=refunds", label: "Remboursements", icon: RefreshCcw },
  { to: "/traveler?tab=reviews", label: "Avis", icon: Star },
  { to: "/traveler?tab=notifications", label: "Notifications", icon: Bell },
  { to: "/traveler?tab=favorites", label: "Chauffeurs favoris", icon: Heart },
  { to: "/traveler?tab=settings", label: "Paramètres", icon: Settings },
];

export type DashboardRole = "admin" | "driver" | "traveler";

const roleLabels: Record<DashboardRole, string> = {
  admin: "Administrateur",
  driver: "Chauffeur",
  traveler: "Voyageur",
};

function SidebarContent({ role, onNavigate }: { role: DashboardRole; onNavigate?: () => void }) {
  const items = role === "admin" ? adminNav : role === "driver" ? driverNav : travelerNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const search = useRouterState({ select: (s) => s.location.searchStr });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>
      </div>
      <div className="border-b border-sidebar-border px-4 py-3">
        <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">
          Espace
        </div>
        <div className="text-sm font-semibold">{roleLabels[role]}</div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-3">
          {items.map((item) => {
            const [path, query] = item.to.split("?");
            const isActive =
              pathname === path && (query ? `?${query}` === search : !search.includes("tab="));
            return (
              <Link
                key={item.to}
                to={item.to as any}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/help"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <HelpCircle className="h-4 w-4" /> Aide
        </Link>
        <Link
          to="/login"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </Link>
      </div>
    </div>
  );
}

export function DashboardLayout({
  role,
  title,
  children,
}: {
  role: DashboardRole;
  title?: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border lg:block">
        <SidebarContent role={role} />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent role={role} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur md:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:block">
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
              {roleLabels[role]}
            </div>
            <div className="text-sm font-semibold">{title ?? "Tableau de bord"}</div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="w-64 pl-9" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -right-0.5 -top-0.5 h-5 min-w-5 px-1 text-[10px]">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium">Nouvelle réservation</span>
                  <span className="text-xs text-muted-foreground">
                    Sara a réservé Alger → Batna · Il y a 5 min
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium">Paiement reçu</span>
                  <span className="text-xs text-muted-foreground">
                    1 320 DA via BaridiMob · Il y a 12 min
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1">
                  <span className="font-medium">Trajet GPS actif</span>
                  <span className="text-xs text-muted-foreground">
                    Oran → Alger · 62% complété
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                      {roleLabels[role][0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-left text-sm md:block">
                    <div className="font-medium leading-none">{roleLabels[role]}</div>
                    <div className="text-xs text-muted-foreground">Compte vérifié</div>
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/help">Aide et assistant</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login">Changer de rôle</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/login">Déconnexion</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
