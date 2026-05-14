export const wilayas = [
  "Alger", "Oran", "Constantine", "Batna", "Sétif", "Annaba", "Blida", "Tlemcen",
  "Béjaïa", "Biskra", "Ghardaïa", "Tizi Ouzou", "Skikda", "Jijel", "Mostaganem",
  "Ouargla", "El Oued", "Chlef", "Médéa", "Bouira",
];

export type TransportType = "Taxi" | "Bus";
export type TripStatus = "Disponible" | "En cours" | "Terminé" | "Annulé";
export type PaymentStatus = "Payé" | "En attente" | "Remboursé" | "Bloqué" | "Libéré";
export type PaymentMethod = "BaridiMob" | "CIB" | "Edahabia";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  wilaya: string;
  transportType: TransportType;
  vehicleBrand: string;
  vehicleModel: string;
  plate: string;
  seats: number;
  rating: number;
  trips: number;
  verified: boolean;
  status: "Actif" | "En attente" | "Suspendu" | "Refusé";
  joinedAt: string;
  avatar?: string;
}

export interface Traveler {
  id: string;
  name: string;
  phone: string;
  email: string;
  wilaya: string;
  trips: number;
  status: "Actif" | "Suspendu";
  joinedAt: string;
}

export interface Trip {
  id: string;
  fromWilaya: string;
  toWilaya: string;
  date: string;
  time: string;
  transportType: TransportType;
  price: number;
  seatsTotal: number;
  seatsAvailable: number;
  bookedSeats: number[];
  driverId: string;
  estimatedDuration: string;
  status: TripStatus;
  rating: number;
  pickupLocation: string;
  dropoffLocation: string;
  gpsStatus: "Inactif" | "Actif";
  progressPercentage: number;
}

export interface Reservation {
  id: string;
  tripId: string;
  travelerId: string;
  seatNumber: number;
  paymentId: string;
  status: "Confirmée" | "En attente" | "Annulée" | "Terminée";
  createdAt: string;
  qrScanned: boolean;
}

export interface Payment {
  transactionId: string;
  reservationId: string;
  travelerId: string;
  driverId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  platformFee: number;
  total: number;
  escrowStatus: "Bloqué" | "Libéré" | "Remboursé";
  createdAt: string;
}

export const drivers: Driver[] = [
  { id: "d1", name: "Ahmed Benali", phone: "+213 555 12 34 56", email: "ahmed.benali@wilayago.dz", wilaya: "Alger", transportType: "Taxi", vehicleBrand: "Hyundai", vehicleModel: "Accent", plate: "00123-116-16", seats: 4, rating: 4.9, trips: 312, verified: true, status: "Actif", joinedAt: "2024-03-12" },
  { id: "d2", name: "Karim Mansouri", phone: "+213 661 22 11 09", email: "karim.m@wilayago.dz", wilaya: "Oran", transportType: "Bus", vehicleBrand: "Mercedes", vehicleModel: "Tourismo", plate: "01432-118-31", seats: 38, rating: 4.7, trips: 188, verified: true, status: "Actif", joinedAt: "2024-01-08" },
  { id: "d3", name: "Samir Haddad", phone: "+213 770 88 21 45", email: "samir.h@wilayago.dz", wilaya: "Sétif", transportType: "Taxi", vehicleBrand: "Renault", vehicleModel: "Symbol", plate: "08821-114-19", seats: 4, rating: 4.6, trips: 254, verified: true, status: "Actif", joinedAt: "2024-05-21" },
  { id: "d4", name: "Youcef Brahimi", phone: "+213 553 47 89 12", email: "youcef.b@wilayago.dz", wilaya: "Annaba", transportType: "Bus", vehicleBrand: "Hyundai", vehicleModel: "Universe", plate: "11223-117-23", seats: 36, rating: 4.8, trips: 142, verified: true, status: "Actif", joinedAt: "2024-02-17" },
  { id: "d5", name: "Mourad Ziani", phone: "+213 698 33 22 11", email: "mourad.z@wilayago.dz", wilaya: "Béjaïa", transportType: "Taxi", vehicleBrand: "Dacia", vehicleModel: "Logan", plate: "04412-115-06", seats: 4, rating: 4.5, trips: 97, verified: false, status: "En attente", joinedAt: "2025-04-10" },
  { id: "d6", name: "Nabil Cherif", phone: "+213 540 11 76 32", email: "nabil.c@wilayago.dz", wilaya: "Constantine", transportType: "Taxi", vehicleBrand: "Peugeot", vehicleModel: "301", plate: "07765-119-25", seats: 4, rating: 4.4, trips: 41, verified: false, status: "En attente", joinedAt: "2025-05-02" },
];

export const travelers: Traveler[] = [
  { id: "t1", name: "Sara Meziane", phone: "+213 555 90 12 34", email: "sara.m@gmail.com", wilaya: "Alger", trips: 18, status: "Actif", joinedAt: "2024-06-12" },
  { id: "t2", name: "Mohamed Khaled", phone: "+213 661 78 45 11", email: "mkhaled@gmail.com", wilaya: "Oran", trips: 9, status: "Actif", joinedAt: "2024-09-04" },
  { id: "t3", name: "Lina Bouchareb", phone: "+213 770 22 33 44", email: "lina.b@gmail.com", wilaya: "Constantine", trips: 24, status: "Actif", joinedAt: "2024-04-18" },
  { id: "t4", name: "Amine Touati", phone: "+213 553 11 22 33", email: "amine.t@gmail.com", wilaya: "Béjaïa", trips: 6, status: "Suspendu", joinedAt: "2025-01-22" },
  { id: "t5", name: "Yasmine Haddad", phone: "+213 698 55 44 33", email: "yasmine.h@gmail.com", wilaya: "Sétif", trips: 31, status: "Actif", joinedAt: "2023-11-30" },
];

export const trips: Trip[] = [
  { id: "tr1", fromWilaya: "Alger", toWilaya: "Batna", date: "2026-05-16", time: "07:30", transportType: "Taxi", price: 2500, seatsTotal: 4, seatsAvailable: 2, bookedSeats: [1, 3], driverId: "d1", estimatedDuration: "5h 30min", status: "Disponible", rating: 4.9, pickupLocation: "Gare routière du Caroubier, Alger", dropoffLocation: "Gare routière de Batna", gpsStatus: "Inactif", progressPercentage: 0 },
  { id: "tr2", fromWilaya: "Oran", toWilaya: "Alger", date: "2026-05-16", time: "08:00", transportType: "Bus", price: 1200, seatsTotal: 38, seatsAvailable: 14, bookedSeats: Array.from({ length: 24 }, (_, i) => i + 1), driverId: "d2", estimatedDuration: "4h 45min", status: "En cours", rating: 4.7, pickupLocation: "Gare routière d'Oran", dropoffLocation: "Gare routière du Caroubier, Alger", gpsStatus: "Actif", progressPercentage: 62 },
  { id: "tr3", fromWilaya: "Sétif", toWilaya: "Constantine", date: "2026-05-17", time: "09:15", transportType: "Taxi", price: 1500, seatsTotal: 4, seatsAvailable: 4, bookedSeats: [], driverId: "d3", estimatedDuration: "2h 10min", status: "Disponible", rating: 4.6, pickupLocation: "Place du 8 Mai 1945, Sétif", dropoffLocation: "Gare routière de Constantine", gpsStatus: "Inactif", progressPercentage: 0 },
  { id: "tr4", fromWilaya: "Annaba", toWilaya: "Alger", date: "2026-05-15", time: "06:00", transportType: "Bus", price: 1800, seatsTotal: 36, seatsAvailable: 0, bookedSeats: Array.from({ length: 36 }, (_, i) => i + 1), driverId: "d4", estimatedDuration: "6h 20min", status: "Terminé", rating: 4.8, pickupLocation: "Gare routière d'Annaba", dropoffLocation: "Gare routière du Caroubier, Alger", gpsStatus: "Inactif", progressPercentage: 100 },
  { id: "tr5", fromWilaya: "Béjaïa", toWilaya: "Tizi Ouzou", date: "2026-05-18", time: "10:30", transportType: "Taxi", price: 1100, seatsTotal: 4, seatsAvailable: 3, bookedSeats: [2], driverId: "d5", estimatedDuration: "1h 50min", status: "Disponible", rating: 4.5, pickupLocation: "Gare routière de Béjaïa", dropoffLocation: "Gare routière de Tizi Ouzou", gpsStatus: "Inactif", progressPercentage: 0 },
  { id: "tr6", fromWilaya: "Alger", toWilaya: "Oran", date: "2026-05-19", time: "14:00", transportType: "Bus", price: 1400, seatsTotal: 38, seatsAvailable: 22, bookedSeats: Array.from({ length: 16 }, (_, i) => i + 1), driverId: "d2", estimatedDuration: "4h 30min", status: "Disponible", rating: 4.7, pickupLocation: "Gare routière du Caroubier, Alger", dropoffLocation: "Gare routière d'Oran", gpsStatus: "Inactif", progressPercentage: 0 },
];

export const reservations: Reservation[] = [
  { id: "r1", tripId: "tr2", travelerId: "t1", seatNumber: 12, paymentId: "p1", status: "Confirmée", createdAt: "2026-05-15T10:24:00", qrScanned: true },
  { id: "r2", tripId: "tr1", travelerId: "t1", seatNumber: 2, paymentId: "p2", status: "Confirmée", createdAt: "2026-05-14T08:12:00", qrScanned: false },
  { id: "r3", tripId: "tr4", travelerId: "t3", seatNumber: 7, paymentId: "p3", status: "Terminée", createdAt: "2026-05-14T19:45:00", qrScanned: true },
  { id: "r4", tripId: "tr6", travelerId: "t2", seatNumber: 18, paymentId: "p4", status: "Confirmée", createdAt: "2026-05-13T11:00:00", qrScanned: false },
  { id: "r5", tripId: "tr3", travelerId: "t5", seatNumber: 1, paymentId: "p5", status: "En attente", createdAt: "2026-05-15T16:30:00", qrScanned: false },
];

export const payments: Payment[] = [
  { transactionId: "TX-2026-0001", reservationId: "r1", travelerId: "t1", driverId: "d2", method: "BaridiMob", status: "Libéré", amount: 1200, platformFee: 120, total: 1320, escrowStatus: "Libéré", createdAt: "2026-05-15T10:24:00" },
  { transactionId: "TX-2026-0002", reservationId: "r2", travelerId: "t1", driverId: "d1", method: "CIB", status: "Bloqué", amount: 2500, platformFee: 200, total: 2700, escrowStatus: "Bloqué", createdAt: "2026-05-14T08:12:00" },
  { transactionId: "TX-2026-0003", reservationId: "r3", travelerId: "t3", driverId: "d4", method: "Edahabia", status: "Libéré", amount: 1800, platformFee: 150, total: 1950, escrowStatus: "Libéré", createdAt: "2026-05-14T19:45:00" },
  { transactionId: "TX-2026-0004", reservationId: "r4", travelerId: "t2", driverId: "d2", method: "BaridiMob", status: "Bloqué", amount: 1400, platformFee: 130, total: 1530, escrowStatus: "Bloqué", createdAt: "2026-05-13T11:00:00" },
  { transactionId: "TX-2026-0005", reservationId: "r5", travelerId: "t5", driverId: "d3", method: "CIB", status: "Remboursé", amount: 1500, platformFee: 130, total: 1630, escrowStatus: "Remboursé", createdAt: "2026-05-15T16:30:00" },
];

export const refunds = [
  { id: "rf1", transactionId: "TX-2026-0005", traveler: "Yasmine Haddad", amount: 1500, reason: "Trajet annulé par le chauffeur", status: "Effectué", date: "2026-05-15" },
  { id: "rf2", transactionId: "TX-2025-9912", traveler: "Amine Touati", amount: 1200, reason: "Place indisponible", status: "Effectué", date: "2026-05-12" },
  { id: "rf3", transactionId: "TX-2025-9908", traveler: "Sara Meziane", amount: 2500, reason: "Demande client", status: "En attente", date: "2026-05-15" },
];

export const reviews = [
  { id: "rv1", from: "Sara Meziane", target: "Ahmed Benali", type: "Avis chauffeur", rating: 5, comment: "Chauffeur ponctuel et professionnel. Voyage très agréable.", date: "2026-05-13", status: "Publié" },
  { id: "rv2", from: "Mohamed Khaled", target: "Karim Mansouri", type: "Avis chauffeur", rating: 4, comment: "Bus confortable, climatisation correcte.", date: "2026-05-12", status: "Publié" },
  { id: "rv3", from: "Lina Bouchareb", target: "Youcef Brahimi", type: "Signalement", rating: 2, comment: "Retard important au départ.", date: "2026-05-10", status: "En attente" },
];

export const notifications = [
  { id: "n1", title: "Confirmation de réservation", body: "Votre réservation Alger → Batna est confirmée.", time: "Il y a 5 minutes", icon: "check" },
  { id: "n2", title: "Paiement confirmé", body: "Paiement de 2 700 DA via CIB reçu.", time: "Il y a 8 minutes", icon: "card" },
  { id: "n3", title: "Rappel avant départ", body: "Votre trajet Oran → Alger démarre dans 1h.", time: "Aujourd'hui à 08:30", icon: "bell" },
  { id: "n4", title: "Arrivée du véhicule", body: "Le chauffeur Ahmed est sur place.", time: "Hier à 18:45", icon: "car" },
  { id: "n5", title: "Remboursement", body: "Un remboursement de 1 500 DA a été effectué.", time: "Il y a 2 jours", icon: "refund" },
];

export const monthlyRevenue = [
  { mois: "Jan", revenus: 480000 }, { mois: "Fév", revenus: 520000 },
  { mois: "Mar", revenus: 610000 }, { mois: "Avr", revenus: 720000 },
  { mois: "Mai", revenus: 890000 }, { mois: "Juin", revenus: 940000 },
  { mois: "Juil", revenus: 1120000 }, { mois: "Août", revenus: 1280000 },
  { mois: "Sep", revenus: 970000 }, { mois: "Oct", revenus: 1040000 },
  { mois: "Nov", revenus: 1180000 }, { mois: "Déc", revenus: 1320000 },
];

export const reservationsByWilaya = [
  { wilaya: "Alger", reservations: 4820 },
  { wilaya: "Oran", reservations: 3110 },
  { wilaya: "Constantine", reservations: 2640 },
  { wilaya: "Sétif", reservations: 1890 },
  { wilaya: "Annaba", reservations: 1620 },
  { wilaya: "Béjaïa", reservations: 1340 },
  { wilaya: "Batna", reservations: 1120 },
];

export const usersGrowth = [
  { mois: "Jan", voyageurs: 8200, chauffeurs: 980 },
  { mois: "Fév", voyageurs: 9100, chauffeurs: 1120 },
  { mois: "Mar", voyageurs: 10800, chauffeurs: 1290 },
  { mois: "Avr", voyageurs: 12400, chauffeurs: 1480 },
  { mois: "Mai", voyageurs: 14200, chauffeurs: 1710 },
  { mois: "Juin", voyageurs: 16500, chauffeurs: 1980 },
];

export const transportSplit = [
  { name: "Taxi", value: 62 },
  { name: "Bus", value: 38 },
];

export const peakHours = [
  { heure: "06h", reservations: 240 },
  { heure: "08h", reservations: 520 },
  { heure: "10h", reservations: 410 },
  { heure: "12h", reservations: 380 },
  { heure: "14h", reservations: 460 },
  { heure: "16h", reservations: 590 },
  { heure: "18h", reservations: 720 },
  { heure: "20h", reservations: 410 },
];

export const adminStats = {
  voyageurs: 124530,
  chauffeurs: 15280,
  taxis: 9840,
  bus: 5440,
  reservations: 254120,
  trajetsEffectues: 198410,
  trajetsAnnules: 4820,
  revenus: 12480000,
  remboursements: 480000,
  paiements: 11990000,
  trajetsGpsActifs: 312,
  chauffeursConnectes: 4180,
  voyageursConnectes: 8920,
  reservationsJour: 1240,
  paiementsJour: 1980000,
};

export function getDriver(id: string) {
  return drivers.find((d) => d.id === id);
}
export function getTrip(id: string) {
  return trips.find((t) => t.id === id);
}
export function getTraveler(id: string) {
  return travelers.find((t) => t.id === id);
}
export function getReservation(id: string) {
  return reservations.find((r) => r.id === id);
}
export function getPayment(id: string) {
  return payments.find((p) => p.transactionId === id || p.reservationId === id);
}

export function formatDA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " DA";
}
