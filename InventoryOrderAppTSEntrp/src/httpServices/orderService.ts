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
    const data = await res.json();
    // return data;

    // return data.map((o: any) => ({
    //     id: o.id,                // or o.orderId
    //     itemId: o.itemId,        // or o.productId
    //     quantity: o.quantity,    // or o.qty
    //     status: o.status,        // or o.orderStatus
    //     createdAt: o.createdAt   // or o.timestamp
    // }));
    return data.map((o: any) => ({
        id: o.id,
        itemId: o.itemId,
        quantity: o.quantity,
        status: o.status,
        total: o.total
    }));
}

export async function createOrder(itemId: number, quantity: number): Promise<dtoOrder> {

    console.log("Calling API:", `${ORDER_BASE}/orders`);    
    console.log("Sending body:", { itemId, quantity });      

    const res = await fetch(`${ORDER_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
    });

    const o = await res.json();
    return {
        id: o.id,
        itemId: o.itemId,
        quantity: o.quantity,
        status: o.status,
        total: o.total
    };

    // console.log("Raw response:", res);    
    // return res.json();
}

