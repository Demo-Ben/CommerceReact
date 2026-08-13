import type { dtoInventory, dtoOrder, dtoPayment } from "../models/dtoModels";

// -----------------------------
// Inventory Mapper
// -----------------------------
export function mapInventory(item: any): dtoInventory {
    return {
        id: item.id,
        name: item.name,
        stock: item.stock,
        price: item.price
    };
}

// -----------------------------
// Order Mapper
// -----------------------------
export function mapOrder(o: any): dtoOrder {
    return {
        id: o.id,
        productId: o.productId,
        // itemId: number;
        quantity: o.quantity,
        status: o.status,
        //total: o.total
        amount: o.amount
    };
}

// -----------------------------
// Payment Mapper
// -----------------------------
export function mapPayment(p: any): dtoPayment {
    return {
        id: p.id,
        orderId: p.orderId,
        amount: p.amount,
        status: p.status,
        paidAt: p.paidAt
    };
}
