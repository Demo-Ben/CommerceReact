import { ORDER_BASE } from "../api/apiClient";
import { mapOrder } from "./mappers";

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
    //     id: o.id,
    //     itemId: o.itemId,
    //     quantity: o.quantity,
    //     status: o.status,
    //     total: o.total
    // }));
    return data.map(mapOrder);
}

export async function createOrder(itemId: number, quantity: number): Promise<dtoOrder> {

    console.log("Calling API:", `${ORDER_BASE}/orders`);    
    console.log("Sending body:", { itemId, quantity });      

    const res = await fetch(`${ORDER_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity })
    });
    // return res.json();

    const o = await res.json();

    // return {
    //     id: o.id,
    //     itemId: o.itemId,
    //     quantity: o.quantity,
    //     status: o.status,
    //     total: o.total
    // };
    return mapOrder(o);
}

// Added: getOrderById to centralize call logic in the service layer
export async function getOrderById(orderId: number): Promise<dtoOrder> {
    const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
    const o = await res.json();
    return mapOrder(o);
}

