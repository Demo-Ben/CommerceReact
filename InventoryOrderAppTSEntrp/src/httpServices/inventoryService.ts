// -------------------------------------------------------------
// Inventory Service
// -------------------------------------------------------------
import { INVENTORY_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// import type introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { dtoInventory } from "../models/dtoModels";


export async function getInventory(): Promise<dtoInventory[]> {
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    const data = await res.json();
    // return data;

    // Mapping layer — future-proof
    return data.map((item: any) => ({
        id: item.id,               // or item.inventoryId
        name: item.name,           // or item.productName
        stock: item.stock,         // or item.qty
        price: item.price          // or item.unitPrice
    }));
}


export async function getInventoryById(id: number): Promise<dtoInventory> {  
    const res = await fetch(`${INVENTORY_BASE}/inventory/{Id}`);
    const data = await res.json();
    // return data;

    // Mapping layer — future-proof
    return {
        id: data.id,               // or data.inventoryId
        name: data.name,           // or data.productName
        stock: data.stock,         // or data.qty
        price: data.price          // or data.unitPrice
    };
}
