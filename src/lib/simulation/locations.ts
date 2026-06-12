// ============================================================
// Simulation Data — San Francisco Locations
// ============================================================

import { Coordinates } from "@/store/types";

export const SF_CENTER: Coordinates = { lat: 37.7749, lng: -122.4194 };

export const WAREHOUSE: {
  location: Coordinates;
  name: string;
  address: string;
} = {
  location: { lat: 37.7694, lng: -122.3929 },
  name: "Central Hub",
  address: "300 Brannan St, SoMa",
};

export interface LocationPoint {
  location: Coordinates;
  name: string;
  address: string;
}

export const DELIVERY_POINTS: LocationPoint[] = [
  { location: { lat: 37.7849, lng: -122.4094 }, name: "Union Square", address: "333 Post St, Union Square" },
  { location: { lat: 37.7879, lng: -122.4074 }, name: "Chinatown", address: "743 Washington St, Chinatown" },
  { location: { lat: 37.7989, lng: -122.4058 }, name: "North Beach", address: "1512 Stockton St, North Beach" },
  { location: { lat: 37.8083, lng: -122.4156 }, name: "Fisherman's Wharf", address: "Pier 39, Fisherman's Wharf" },
  { location: { lat: 37.7756, lng: -122.4193 }, name: "Civic Center", address: "1 Dr Carlton B Goodlett Pl" },
  { location: { lat: 37.7599, lng: -122.4148 }, name: "Mission District", address: "2223 Mission St, Mission" },
  { location: { lat: 37.7647, lng: -122.4281 }, name: "Castro", address: "501 Castro St, Castro" },
  { location: { lat: 37.7749, lng: -122.4344 }, name: "Hayes Valley", address: "432 Octavia St, Hayes Valley" },
  { location: { lat: 37.7849, lng: -122.4394 }, name: "Pacific Heights", address: "2100 Fillmore St, Pacific Heights" },
  { location: { lat: 37.7699, lng: -122.4484 }, name: "Inner Sunset", address: "1315 9th Ave, Inner Sunset" },
  { location: { lat: 37.7579, lng: -122.3929 }, name: "Dogpatch", address: "2229 3rd St, Dogpatch" },
  { location: { lat: 37.7841, lng: -122.3900 }, name: "Embarcadero", address: "1 Ferry Building, Embarcadero" },
  { location: { lat: 37.7925, lng: -122.3970 }, name: "Financial District", address: "555 California St, FiDi" },
  { location: { lat: 37.7551, lng: -122.4199 }, name: "Bernal Heights", address: "401 Cortland Ave, Bernal Heights" },
  { location: { lat: 37.7695, lng: -122.4530 }, name: "Golden Gate Park", address: "50 Hagiwara Tea Garden Dr" },
  { location: { lat: 37.7622, lng: -122.3942 }, name: "Potrero Hill", address: "300 De Haro St, Potrero Hill" },
  { location: { lat: 37.8025, lng: -122.4187 }, name: "Russian Hill", address: "1000 Lombard St, Russian Hill" },
  { location: { lat: 37.7765, lng: -122.3951 }, name: "South Beach", address: "500 Beale St, South Beach" },
  { location: { lat: 37.7505, lng: -122.4140 }, name: "Glen Park", address: "2816 Diamond St, Glen Park" },
  { location: { lat: 37.7950, lng: -122.4219 }, name: "Nob Hill", address: "999 California St, Nob Hill" },
  { location: { lat: 37.7810, lng: -122.4590 }, name: "Presidio", address: "103 Montgomery St, Presidio" },
  { location: { lat: 37.7680, lng: -122.4090 }, name: "SoMa", address: "888 Brannan St, SoMa" },
  { location: { lat: 37.7580, lng: -122.4370 }, name: "Noe Valley", address: "3861 24th St, Noe Valley" },
  { location: { lat: 37.7710, lng: -122.4680 }, name: "Outer Sunset", address: "2239 Taraval St, Outer Sunset" },
];

export const CUSTOMER_NAMES = [
  "Alex Chen", "Maria Rodriguez", "James Park", "Sarah Kim", "David Wilson",
  "Emily Zhang", "Ryan O'Brien", "Lisa Tanaka", "Michael Brooks", "Jessica Lee",
  "Thomas Anderson", "Priya Patel", "Carlos Mendez", "Hannah Jones", "Kevin Tran",
  "Rachel Green", "Sam Miller", "Olivia Davis", "Nathan Scott", "Emma Thompson",
];

export const PACKAGE_TYPES = [
  "Electronics", "Documents", "Food Delivery", "Medical Supplies",
  "Fragile Package", "Express Parcel", "Retail Order", "Subscription Box",
  "Gift Package", "Industrial Parts", "Perishable Goods", "Bulk Shipment",
];

export const DRIVER_PROFILES = [
  { id: "DRV-01", name: "Marcus Rivera", avatar: "MR", vehicleType: "Van", rating: 4.9 },
  { id: "DRV-02", name: "Aisha Johnson", avatar: "AJ", vehicleType: "Truck", rating: 4.8 },
  { id: "DRV-03", name: "Kai Nakamura", avatar: "KN", vehicleType: "Van", rating: 4.7 },
  { id: "DRV-04", name: "Elena Petrov", avatar: "EP", vehicleType: "Sedan", rating: 4.9 },
  { id: "DRV-05", name: "Devon Williams", avatar: "DW", vehicleType: "Van", rating: 4.6 },
  { id: "DRV-06", name: "Sofia Chang", avatar: "SC", vehicleType: "Truck", rating: 4.8 },
  { id: "DRV-07", name: "Omar Hassan", avatar: "OH", vehicleType: "Sedan", rating: 4.5 },
  { id: "DRV-08", name: "Yuki Tanaka", avatar: "YT", vehicleType: "Van", rating: 4.7 },
];

export const INITIAL_DRIVER_POSITIONS: Coordinates[] = [
  { lat: 37.7749, lng: -122.4194 },
  { lat: 37.7849, lng: -122.4094 },
  { lat: 37.7699, lng: -122.3994 },
  { lat: 37.7799, lng: -122.4294 },
  { lat: 37.7649, lng: -122.4194 },
  { lat: 37.7899, lng: -122.4144 },
  { lat: 37.7749, lng: -122.4044 },
  { lat: 37.7599, lng: -122.4244 },
];
