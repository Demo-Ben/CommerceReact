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
    const data = await res.json();
    // return data;

    return data.map((p: any) => ({
        id: p.id,
        orderId: p.orderId,
        amount: p.amount,
        status: p.status
    }));
}

export async function payOrder(orderId: number, amount: number): Promise<dtoPayment> {
    const res = await fetch(`${PAYMENT_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount })
    });
    const p = await res.json();

    return {
        id: p.id,
        orderId: p.orderId,
        amount: p.amount,
        status: p.status
    };
    // return res.json();
}

