import { INVENTORY_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// TypeScript interfaces for API responses
// (Now imported from shared enterprise-grade model file)
//introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { InventoryItem} from "../models/apiModels";

// -------------------------------------------------------------
// Inventory Service
// -------------------------------------------------------------
export async function getInventory(): Promise<InventoryItem[]> {  // renamed from "inventory"
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    return res.json();
}
