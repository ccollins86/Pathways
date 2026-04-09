import { GameWorld } from "@/lib/stores/useGame";

export type OutfitPattern =
  | "reflective-stripes"
  | "cargo-pockets"
  | "wetsuit-panels"
  | "knee-pads"
  | "name-patch"
  | "riveted"
  | "mystic-runes"
  | "shimmer";

export interface OutfitItem {
  id: string;
  name: string;
  type: "shirt" | "pants";
  price: number;
  color: string;
  world: GameWorld;
  secondaryColor?: string;
  pattern?: OutfitPattern;
  emissive?: string;
  metalness?: number;
  roughness?: number;
}

export const OUTFIT_CATALOG: OutfitItem[] = [
  {
    id: "town-shirt",
    name: "Safety Vest",
    type: "shirt",
    price: 25,
    color: "#ff6d00",
    world: "town",
    secondaryColor: "#c0c0c0",
    pattern: "reflective-stripes",
    roughness: 0.3,
  },
  {
    id: "town-pants",
    name: "Cargo Pants",
    type: "pants",
    price: 20,
    color: "#c2b280",
    world: "town",
    secondaryColor: "#8a7a50",
    pattern: "cargo-pockets",
  },
  {
    id: "ocean-shirt",
    name: "Wetsuit Top",
    type: "shirt",
    price: 30,
    color: "#00897b",
    world: "ocean",
    secondaryColor: "#b2ff59",
    pattern: "wetsuit-panels",
    roughness: 0.2,
  },
  {
    id: "ocean-pants",
    name: "Dive Pants",
    type: "pants",
    price: 25,
    color: "#1a3a5c",
    world: "ocean",
    secondaryColor: "#37474f",
    pattern: "knee-pads",
    roughness: 0.3,
  },
  {
    id: "factory-shirt",
    name: "Mechanic Shirt",
    type: "shirt",
    price: 30,
    color: "#757575",
    world: "factory",
    secondaryColor: "#ff5722",
    pattern: "name-patch",
    roughness: 0.8,
  },
  {
    id: "factory-pants",
    name: "Work Denim",
    type: "pants",
    price: 25,
    color: "#2c3e6b",
    world: "factory",
    secondaryColor: "#ffc107",
    pattern: "riveted",
    roughness: 0.7,
  },
  {
    id: "psychic-shirt",
    name: "Mystic Robe",
    type: "shirt",
    price: 35,
    color: "#7b1fa2",
    world: "psychic",
    secondaryColor: "#e040fb",
    pattern: "mystic-runes",
    emissive: "#e040fb",
    metalness: 0.4,
    roughness: 0.3,
  },
  {
    id: "psychic-pants",
    name: "Enchanted Leggings",
    type: "pants",
    price: 30,
    color: "#4a148c",
    world: "psychic",
    secondaryColor: "#7c4dff",
    pattern: "shimmer",
    emissive: "#7c4dff",
    metalness: 0.6,
    roughness: 0.2,
  },
];

export function getOutfitsForWorld(world: GameWorld): OutfitItem[] {
  return OUTFIT_CATALOG.filter((item) => item.world === world);
}

export function getOutfitById(id: string): OutfitItem | undefined {
  return OUTFIT_CATALOG.find((item) => item.id === id);
}
