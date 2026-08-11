//1️. Imports
import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function PaymentPage() {
    // 1.Pull values from context
    const { orders, payments, payOrder, getOrderById } = useApi();

    // 2.Local state
    const [selectedOrderId, setSelectedOrderId] = useState<string>("");


    //3. Derived data (computed on every render)
    // Only show orders that are not yet paid
    const unpaidOrders = orders.filter(o => o.status !== "Paid");


    //4. First‑time payment handler
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


    //5. Pay‑again handler
    // ---------------------------------------------------------
    // Pay Again handler (used in payment history)
    // Must fetch the order to get the correct total
    // ---------------------------------------------------------
    const handlePayAgain = async (payment: { orderId: number }) => {
        const order = await getOrderById(payment.orderId);

        if (!window.confirm(`Pay $${order.total} again?`)) return;

        await payOrder(order.id, order.total);
    };

    // helper to render a readable date/time
    const formatDate = (value?: string | Date | null) => {
        if (!value) return "";

        const d = typeof value === "string" ? new Date(value) : value;

        if (Number.isNaN(d.getTime())) return String(value);

        // choose desired format:
        //return d.toLocaleDateString();           // date only
        return d.toLocaleString();            // date + time (localized)
        // return d.toLocaleString("en-US", {    // example: "Aug 11, 2026, 2:34 PM"
        //     year: "numeric",
        //     month: "short",
        //     day: "numeric",
        //     hour: "numeric",
        //     minute: "2-digit"
        // });
    };

    // helper local currency formatter (used only in this file)
    const formatCurrency = (
        value?: number | string | null,
        currency = "AUD",
        locale = "en-US",
        minimumFractionDigits = 2,
        maximumFractionDigits = 2
    ): string => {
        if (value === null || value === undefined || value === "") return "";

        const num = typeof value === "string" ? Number(value) : value;
        if (Number.isNaN(num as number)) return String(value);

        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(num as number);
    };

    return (
        <div>
            <h2>Payments</h2>

            {/* ---------------------------------------------------------
                Section 1: Pay an unpaid order
               --------------------------------------------------------- */}
            <h3>Pay Existing Order by the Order list</h3>
            <div>
                <select value={selectedOrderId}
                    onChange={e => setSelectedOrderId(e.target.value)} >

                    <option value="">-- Please select unpaid order --</option>

                    {/* the pattern: map unpaidOrders into <option> elements. */}
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
            <h3>Order Payment History</h3>

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
                                <th>Paid On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* payments.map(...) loops through your payment array. */}
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.orderId}</td>
                                    <td>{formatCurrency(p.amount)}</td>
                                    <td>{p.status}</td>
                                    <td>{formatDate(p.paidAt)}</td>
                                    <td>                  
                                        {p.status !== "Completed" && (
                                            <button onClick={() => handlePayAgain(p)}>
                                                Pay Again
                                            </button>
                                        )}
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
