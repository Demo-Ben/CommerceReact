// function PaymentPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default PaymentPage;

import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function PaymentPage() {
    const { orders, payments, payOrder } = useApi();
    const [selectedOrderId, setSelectedOrderId] = useState("");

    const unpaidOrders = orders.filter(o => o.status !== "Paid");

    const handlePay = () => {
        if (!selectedOrderId) return;
        payOrder(Number(selectedOrderId));
        setSelectedOrderId("");
    };

    return (
        <div>
            <h2>Payments</h2>

            <h3>Pay Order</h3>
            <div>
                <select
                    value={selectedOrderId}
                    onChange={e => setSelectedOrderId(e.target.value)}
                >
                    <option value="">-- select unpaid order --</option>
                    {unpaidOrders.map(o => (
                        <option key={o.id} value={o.id}>
                            Order #{o.id} - ${o.total} ({o.status})
                        </option>
                    ))}
                </select>
                <button onClick={handlePay}>Pay</button>
            </div>

            <h3>Payment History</h3>
            {payments.length === 0 && <p>No payments yet.</p>}
            {payments.length > 0 && (
                <table border="1" cellPadding="4">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>OrderId</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.orderId}</td>
                                <td>${p.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
