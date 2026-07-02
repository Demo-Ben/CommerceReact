// -------------------------------------------------------------
// TypeScript interfaces for your domain models
// -------------------------------------------------------------

export interface InventoryItem {
    id: number;
    name: string;
    stock: number;
    price: number;
}

export interface Order {
    id: number;
    itemId: number;
    quantity: number;
    total: number;
    status: string;
}

export interface Payment {
    id: number;
    orderId: number;
    amount: number;
    status: string;
}
