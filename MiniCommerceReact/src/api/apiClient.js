// console.log("Hello World!")

//This is your React → Microservices gateway.

// const API_BASE = "https://localhost:5001"; // your gateway or service URL
const API_BASE = "https://localhost:5002";      // OrderService port

const ORDER_BASE = "https://localhost:5002";
const INVENTORY_BASE = "https://localhost:5003";
const PaymentService = "https://localhost:5004";


//InventoryService port
export async function getInventory() {
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    return res.json();
}


// OrdrerService port
export async function createOrder(itemId, quantity) {

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

export async function getOrders() {
    const res = await fetch(`${ORDER_BASE}/orders`);
    return res.json();
}

export async function payOrder(orderId) {
    const res = await fetch(`${ORDER_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId })
    });
    return res.json();
}


//payment service port
export async function getPayments() {
    const res = await fetch(`${API_BASE}/payments`);
    return res.json();
}
