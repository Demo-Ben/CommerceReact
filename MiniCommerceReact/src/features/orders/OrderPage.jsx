// function OrderPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default OrderPage;

import React from "react";
import { useApi } from "../../context/ApiContext";

export default function OrderPage() {
    const { orders, inventory, payOrder } = useApi();

    const getItemName = itemId =>
        inventory.find(i => i.id === itemId)?.name || "Unknown";

    return (
        <div>
            <h2>Orders</h2>
            {orders.length === 0 && <p>No orders yet.</p>}
            {orders.length > 0 && (
                <table border="1" cellPadding="4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Action</th>
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
                                    <button onClick={() => payOrder(order.id, order.total)}>
                                        Pay
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
