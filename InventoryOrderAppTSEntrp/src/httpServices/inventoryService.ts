import { INVENTORY_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// import type introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { dtoInventory } from "../models/dtoModels";

// -------------------------------------------------------------
// Inventory Service
// -------------------------------------------------------------
export async function getInventory(): Promise<dtoInventory[]> {  // renamed from "inventory"
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    return res.json();
}

export async function getInventoryById(id: number): Promise<dtoInventory> {  
    const res = await fetch(`${INVENTORY_BASE}/inventory/{Id}`);
    return res.json();
}
