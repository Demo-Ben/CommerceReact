// function OrderPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }
// export default OrderPage;


import React from "react";
import { useApi } from "../../context/ApiContext";

export default function OrderPage() {
    const { inventorys, orders, createOrder, payOrder } = useApi();         // renamed from "inventory"

    // Helper: get item name from inventory
    // TypeScript ensures itemId is a number and inventory items are typed
    function getItemName(itemId: number): string {
        const item = inventorys.find(i => i.id === itemId);                 // renamed from "inventory"
        return item ? item.name : "Unknown";
    }

    // Create a new order
    async function handleCreateOrder(itemId: number) {
        const ok = window.confirm("Create this order?");
        if (!ok) return;

        const quantity = 1; // or use a UI input
        await createOrder(itemId, quantity);
    }

    // Pay for an order
    async function handlePay(order: { id: number; total: number }) {
        const ok = window.confirm(`Pay $${order.total} for this order?`);
        if (!ok) return;

        await payOrder(order.id, order.total);
    }

    return (
        <div>
            <h2>Orders</h2>

            {/* ---------------------------------------------------------
                Inventory List (Create Order)
                --------------------------------------------------------- 
            */}
            <h3>Inventory</h3>

            <div
                style={{
                    display: "flex",              // enable flexbox
                    justifyContent: "center",     // center horizontally
                    marginTop: "20px"             // optional spacing
                }}
            >
                <table border={1} cellPadding={4}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Create Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventorys.map(item => (           // renamed from "inventory"
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>${item.price}</td>
                                <td>
                                    <button onClick={() => handleCreateOrder(item.id)}>
                                        Create Order
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ---------------------------------------------------------
                Orders List (Pay Button)
            --------------------------------------------------------- */}
            <h3>Orders</h3>

            <div
                style={{
                    display: "flex",              // enable flexbox
                    justifyContent: "center",     // center horizontally
                    marginTop: "20px"             // optional spacing
                }}
            >
                <table border={1} cellPadding={4}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{getItemName(order.itemId)}</td>
                                <td>{order.quantity}</td>
                                <td>${order.total}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status !== "Paid" && (
                                        <button onClick={() => handlePay(order)}>
                                            Pay
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
