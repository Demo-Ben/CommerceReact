export interface dtoInventory {
    id: number;
    name: string;
    stock: number;
    price: number;
}

export interface dtoOrder {
    id: number;
    productId: number;       // itemId: number;   
    quantity: number;   
    amount: number;     //total: number;
    status: string;
}

export interface dtoPayment {
    id: number;
    orderId: number;
    amount: number;
    status: string;   // we decided to include status for Payment
    paidAt: string
}
