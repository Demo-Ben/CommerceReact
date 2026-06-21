// function OrderPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default OrderPage;



import React from "react";
import { useApi } from "../../context/ApiContext";

export default function OrderPage() {
    const { inventory, orders, createOrder, payOrder } = useApi();

    // Helper: get item name from inventory
    function getItemName(itemId) {
        const item = inventory.find(i => i.id === itemId);
        return item ? item.name : "Unknown";
    }

    // Create a new order
    async function handleCreateOrder(itemId) {
        const quantity = 1; // or use a UI input
        await createOrder(itemId, quantity);
    }

    // Pay for an order
    async function handlePay(order) {
        await payOrder(order.id, order.total);
    }

    return (
        <div>
            <h2>Orders</h2>

            {/* ---------------------------------------------------------
                Inventory List (Create Order)
            --------------------------------------------------------- */}
            <h3>Inventory</h3>
            <table border="1" cellPadding="4">
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
                    {inventory.map(item => (
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

            {/* ---------------------------------------------------------
                Orders List (Pay Button)
            --------------------------------------------------------- */}
            <h3>Orders</h3>
            <table border="1" cellPadding="4">
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
    );
}



// import React from "react";
// import { useApi } from "../../context/ApiContext";

// export default function OrderPage() {
//     const { orders, inventory, payOrder } = useApi();

//     const getItemName = itemId =>
//         inventory.find(i => i.id === itemId)?.name || "Unknown";

//     return (
//         <div>
//             <h2>Orders</h2>
//             {orders.length === 0 && <p>No orders yet.</p>}
//             {orders.length > 0 && (
//                 <table border="1" cellPadding="4">
//                     <thead>
//                         <tr>
//                             <th>Id</th>
//                             <th>Item</th>
//                             <th>Qty</th>
//                             <th>Total</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {orders.map(order => (
//                             <tr key={order.id}>
//                                 <td>{order.id}</td>
//                                 <td>{getItemName(order.itemId)}</td>
//                                 <td>{order.quantity}</td>
//                                 <td>${order.total}</td>
//                                 <td>{order.status}</td>
//                                 <td>
//                                     <button onClick={() => payOrder(order.id, order.total)}>
//                                         Pay
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }
