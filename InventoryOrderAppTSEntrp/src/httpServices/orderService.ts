import { ORDER_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// TypeScript interfaces for API responses
// (Now imported from shared enterprise-grade model file)
//introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { Order } from "../models/apiModels";

// -------------------------------------------------------------
// Order Service
// -------------------------------------------------------------
export async function getOrders(): Promise<Order[]> {
    const res = await fetch(`${ORDER_BASE}/orders`);
    return res.json();
}

export async function createOrder(itemId: number, quantity: number): Promise<Order> {

    console.log("Calling API:", `${ORDER_BASE}/orders`);    // ← ADD THIS
    console.log("Sending body:", { itemId, quantity });     // ← ADD THIS

    const res = await fetch(`${ORDER_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
    });

    console.log("Raw response:", res);   // ← ADD THIS
    return res.json();
}

