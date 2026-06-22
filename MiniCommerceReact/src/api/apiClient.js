// apiClient.js defines service functions (client‑side services), not Web API controller functions.
// apiClient.js is your frontend service layer — a set of client‑side service functions that know how to talk to your backend microservices.


//This is your React → Microservices gateway.
// const API_BASE = "https://localhost:5001"; // your gateway or service URL

//const ORDER_BASE = "https://localhost:5002";
export const ORDER_BASE = "https://localhost:5002";

const INVENTORY_BASE = "https://localhost:5003";
const PAYMENT_BASE = "https://localhost:5004";


//Inventory Service
export async function getInventory() {
    const res = await fetch(`${INVENTORY_BASE}/inventory`);
    return res.json();
}


// Order Service
export async function getOrders() {
    const res = await fetch(`${ORDER_BASE}/orders`);
    return res.json();
}

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


//payment service
export async function getPayments() {
    const res = await fetch(`${PAYMENT_BASE}/payments`);
    return res.json();
}

export async function payOrder(orderId, amount) {
    const res = await fetch(`${PAYMENT_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, amount })
    });
    return res.json();
}


