export const ORDER_BASE = "https://localhost:5002";
const INVENTORY_BASE = "https://localhost:5003";
const PAYMENT_BASE = "https://localhost:5004";

// -------------------------------------------------------------
// TypeScript interfaces for API responses
// (Now imported from shared enterprise-grade model file)
//introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { InventoryItem, Order, Payment } from "../models/apiModels";


// -------------------------------------------------------------
// Inventory Service
// -------------------------------------------------------------
export async function getInventory(): Promise<InventoryItem[]> {  // renamed from "inventory"
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    return res.json();
}


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


// -------------------------------------------------------------
// Payment Service
// -------------------------------------------------------------
export async function getPayments(): Promise<Payment[]> {
    const res = await fetch(`${PAYMENT_BASE}/payments`);
    return res.json();
}

export async function payOrder(orderId: number, amount: number): Promise<Payment> {
    const res = await fetch(`${PAYMENT_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount })
    });
    return res.json();
}

