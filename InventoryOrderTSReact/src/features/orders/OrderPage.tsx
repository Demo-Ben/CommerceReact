//1️. Imports
import React from "react";


//This hook is the “bridge” between your UI and backend.
// useApi() is your custom hook that exposes:
//      inventorys → list of item
//      orders → list of existing orders
//      createOrder() → API call
//      payOrder() → API call
import { useApi } from "../../context/ApiContext";


//2. Component definition
// Render #1 → React calls OrderPage() → useApi() → UI shows
// Render #2 → orders updated → React calls OrderPage() → useApi() → UI updates
// Render #3 → payOrder() changed context → React calls OrderPage() → useApi() → UI updates
// Render #4 → navigation → React calls OrderPage() → useApi() → UI shows again
export default function OrderPage() {

    // 3. Extract API values: This pulls values from your API context provider
    //                        ,not fetch data rather simply reads values from your context provider.
    //    This line runs every time your component renders.
    //    “render” means in React:
    //        1. The first time the component is displayed on the screen.
    //        2. Any state changes (useState)
    //        3. Any context values change (useApi)
    //        4. Any parent component re-renders
    const { inventorys, orders, createOrder, payOrder } = useApi();         


    //4. Helper: get item name
    // function getItemName(itemId: number): string {
    //     const item = inventorys.find(i => i.id === itemId);
    //     return item ? item.name : "Unknown";
    // }
    function getItemName(productId: number): string {
        const item = inventorys.find(i => i.id === productId);                  
        return item ? item.name : "Unknown";
    }

    //5.Create a new order
    async function handleCreateOrder(productId: number) {
        const ok = window.confirm("Create this order?");
        if (!ok) return;

        const quantity = 1; // or use a UI input
        await createOrder(productId, quantity);
    }

    //6. Pay for an order
    async function handlePay(order: { id: number; amount: number }) {
        const ok = window.confirm(`Pay $${order.amount} for this order?`);
        if (!ok) return;

        await payOrder(order.id, order.amount);
    }

    const tableContainerStyle: React.CSSProperties = {
        display: "flex",              // enable flexbox
        justifyContent: "center",     // center horizontally
        marginTop: "20px"             // optional spacing
    };
    return (
        <div>
            <h2>Create New Order by Inventory List</h2>

            {/* Inventory List (Create Order) */}
            <h3>Available Inventory</h3>

            <div style={tableContainerStyle}>
                <table border={1} cellPadding={4}>
                    <thead>
                        <tr>
                            <th>Stock ID</th>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Price</th>
                            <th>Create Order</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                        {inventorys.map(item => (           
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

            {/* Orders List (Pay Button)*/}
            <h3>Existing Orders</h3>

            <div style={tableContainerStyle}>
                <table border={1} cellPadding={4}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* orders.map(...) loops through your order array.
                              <td>{getItemName(order.itemId)}</td>
                              */}
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{getItemName(order.productId)}</td>
                                <td>{order.quantity}</td>
                                <td>${order.amount}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.status !== "Paid" && (
                                        <button onClick={() => handlePay(order)}> Pay </button>
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




// ========================================================
// FILE: OrderPage.tsx template
// ========================================================

// import { useState } from 'react';
// 1. The main function contains your LOGIC
// export default function OrderPage() {
//     // LOGIC ZONE
//     const [totalPrice, setTotalPrice] = useState(0);

//     function applyDiscount() {
//         setTotalPrice(prev => prev * 0.9); // 10% off logic
//      }

//     2. The return statement outputs your WEB UI
//     return (
//         <div className="page-layout">
//             <h1>Order Summary</h1>

//             {/* Visual representation of the logic variable */}
//             <p>Total: ${totalPrice}</p>

//             {/* Clicking this UI element fires the logic function above */}
//             <button onClick={applyDiscount}>Apply Coupon</button>
//         </div>
//     );
// }
