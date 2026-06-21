// function OrderPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default OrderPage;

import React from "react";
import { useApi } from "../../context/ApiContext";

export default function OrderPage() {
    const { orders, inventory } = useApi();

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
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id}>
                                <td>{o.id}</td>
                                <td>{getItemName(o.itemId)}</td>
                                <td>{o.quantity}</td>
                                <td>${o.total}</td>
                                <td>{o.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
