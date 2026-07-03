import {  PAYMENT_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// import type introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { dtoPayment } from "../models/dtoModels";

// -------------------------------------------------------------
// Payment Service
// -------------------------------------------------------------
export async function getPayments(): Promise<dtoPayment[]> {
    const res = await fetch(`${PAYMENT_BASE}/payments`);
    return res.json();
}

export async function payOrder(orderId: number, amount: number): Promise<dtoPayment> {
    const res = await fetch(`${PAYMENT_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount })
    });
    return res.json();
}

