import {  PAYMENT_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// TypeScript interfaces for API responses
// (Now imported from shared enterprise-grade model file)
//introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { Payment } from "../models/apiModels";

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

