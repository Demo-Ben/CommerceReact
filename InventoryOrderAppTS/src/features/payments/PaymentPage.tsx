// function PaymentPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default PaymentPage;

import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function PaymentPage() {
    // Pull everything we need from ApiContext
    const { orders, payments, payOrder, getOrderById } = useApi();

    // Track which order is selected in the dropdown
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");

    // Only show orders that are not yet paid
    const unpaidOrders = orders.filter(o => o.status !== "Paid");

    // ---------------------------------------------------------
    // Pay button for the dropdown (first-time payment)
    // Must be async because we use await inside
    // ---------------------------------------------------------
    const handlePay = async () => {
        if (!selectedOrderId) return;

        const order = orders.find(o => o.id === Number(selectedOrderId));
        if (!order) return;

        await payOrder(order.id, order.total);

        setSelectedOrderId("");
    };

    // ---------------------------------------------------------
    // Pay Again handler (used in payment history)
    // Must fetch the order to get the correct total
    // ---------------------------------------------------------
    const handlePayAgain = async (payment: { orderId: number }) => {
        const order = await getOrderById(payment.orderId);

        if (!window.confirm(`Pay $${order.total} again?`)) return;

        await payOrder(order.id, order.total);
    };

    return (
        <div>
            <h2>Payments</h2>

            {/* ---------------------------------------------------------
                Section 1: Pay an unpaid order
               --------------------------------------------------------- */}
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

            {/* ---------------------------------------------------------
                Section 2: Payment History
               --------------------------------------------------------- */}
            <h3>Payment History</h3>

            {payments.length === 0 && <p>No payments yet.</p>}

            {payments.length > 0 && (
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
                                <th>OrderId</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.orderId}</td>
                                    <td>${p.amount}</td>
                                    <td>{p.status}</td>
                                    <td>
                                        <button onClick={() => handlePayAgain(p)}>
                                            Pay Again
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
