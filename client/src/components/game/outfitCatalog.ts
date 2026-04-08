import { GameWorld } from "@/lib/stores/useGame";

export interface OutfitItem {
  id: string;
  name: string;
  type: "shirt" | "pants";
  price: number;
  color: string;
  world: GameWorld;
}

export const OUTFIT_CATALOG: OutfitItem[] = [
  {
    id: "town-shirt",
    name: "Safety Vest",
    type: "shirt",
    price: 25,
    color: "#ff6d00",
    world: "town",
  },
  {
    id: "town-pants",
    name: "Cargo Pants",
    type: "pants",
    price: 20,
    color: "#c2b280",
    world: "town",
  },
  {
    id: "ocean-shirt",
    name: "Wetsuit Top",
    type: "shirt",
    price: 30,
    color: "#00897b",
    world: "ocean",
  },
  {
    id: "ocean-pants",
    name: "Dive Pants",
    type: "pants",
    price: 25,
    color: "#1a3a5c",
    world: "ocean",
  },
  {
    id: "factory-shirt",
    name: "Mechanic Shirt",
    type: "shirt",
    price: 30,
    color: "#757575",
    world: "factory",
  },
  {
    id: "factory-pants",
    name: "Work Denim",
    type: "pants",
    price: 25,
    color: "#2c3e6b",
    world: "factory",
  },
];

export function getOutfitsForWorld(world: GameWorld): OutfitItem[] {
  return OUTFIT_CATALOG.filter((item) => item.world === world);
}

export function getOutfitById(id: string): OutfitItem | undefined {
  return OUTFIT_CATALOG.find((item) => item.id === id);
}
