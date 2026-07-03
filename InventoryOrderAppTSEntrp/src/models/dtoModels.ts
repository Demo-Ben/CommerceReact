// -------------------------------------------------------------
// Shared domain models (DTOs + frontend state)
// Single source of truth for types
// -------------------------------------------------------------

export interface InventoryItem {
    id: number;
    name: string;
    stock: number;
    price: number;
}

export interface OrderItem {
    id: number;
    itemId: number;
    quantity: number;
    total: number;
    status: string;
}

export interface PaymentItem {
    id: number;
    orderId: number;
    amount: number;
    status: string;   // we decided to include status for Payment
}
