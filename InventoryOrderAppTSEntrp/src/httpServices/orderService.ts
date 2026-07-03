import { ORDER_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// import type introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { dtoOrder } from "../models/dtoModels";

// -------------------------------------------------------------
// Order Service
// -------------------------------------------------------------
export async function getOrders(): Promise<dtoOrder[]> {
    const res = await fetch(`${ORDER_BASE}/orders`);
    return res.json();
}

export async function createOrder(itemId: number, quantity: number): Promise<dtoOrder> {

    console.log("Calling API:", `${ORDER_BASE}/orders`);    
    console.log("Sending body:", { itemId, quantity });      

    const res = await fetch(`${ORDER_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
    });

    console.log("Raw response:", res);    
    return res.json();
}

