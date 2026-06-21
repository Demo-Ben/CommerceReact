import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
    getInventory,
    getOrders,
    getPayments,
    createOrder as apiCreateOrder,
    payOrder as apiPayOrder
} from "../api/apiClient";

// -------------------------------------------------------------
// ApiContext
// Acts like a lightweight front-end "service container"
// Provides shared state + service calls to all React components
// -------------------------------------------------------------
const ApiContext = createContext();

// -------------------------------------------------------------
// Initial state for the reducer
// Mirrors the 3 microservices: Inventory, Orders, Payments
// -------------------------------------------------------------
const initialState = {
    inventory: [
        { id: 1, name: "Laptop", stock: 5, price: 1500 },
        { id: 2, name: "Mouse", stock: 20, price: 25 }
    ],
    orders: [],
    payments: []
};


// -------------------------------------------------------------
// Reducer
// Centralized state transitions triggered by service calls
// -------------------------------------------------------------
function reducer(state, action) {
    switch (action.type) {

        // ---------------------------------------------------------
        // LOAD_DATA
        // Fired once on startup after fetching all 3 services
        // ---------------------------------------------------------
        case "LOAD_DATA":
            return {
                ...state,
                inventory: action.payload.inventory,
                orders: action.payload.orders,
                payments: action.payload.payments
            };

        // ---------------------------------------------------------
        // ORDER_CREATED
        // Fired after POST /orders returns a new order
        // ---------------------------------------------------------
        case "ORDER_CREATED":
            return {
                ...state,
                orders: [...state.orders, action.payload]
            };

        // ---------------------------------------------------------
        // ORDER_PAID
        // Fired after POST /payments returns a payment record
        // Also updates the order status to "Paid"
        // ---------------------------------------------------------
        case "ORDER_PAID":
            return {
                ...state,
                payments: [...state.payments, action.payload],
                orders: state.orders.map(o =>
                    o.id === action.payload.orderId
                        ? { ...o, status: "Paid" }
                        : o
                )
            };

        default:
            return state;
    }
}

// -------------------------------------------------------------
// loadData()
// Fetches all 3 microservices on startup
// Equivalent to orchestrating multiple backend calls
// -------------------------------------------------------------
async function loadData(dispatch) {
    const inventory = await getInventory();
    const orders = await getOrders();
    const payments = await getPayments();

    dispatch({
        type: "LOAD_DATA",
        payload: { inventory, orders, payments }
    });
}

// -------------------------------------------------------------
// ApiProvider
// Wraps the entire React app and exposes:
// - Shared state (inventory, orders, payments)
// - Service functions (createOrder, payOrder)
// -------------------------------------------------------------
export function ApiProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // -----------------------------------------------------------
    // Load all services when the app first mounts
    // Equivalent to "startup orchestration" in microservices
    // -----------------------------------------------------------
    useEffect(() => {
        loadData(dispatch);
    }, []);

    // -----------------------------------------------------------
    // createOrder()
    // Calls OrderService → POST /orders
    // Then updates front-end state with the returned order
    // -----------------------------------------------------------
    // async function createOrder(itemId, quantity) {
    //     const order = await apiCreateOrder(itemId, quantity);

    //     dispatch({
    //         type: "ORDER_CREATED",
    //         payload: order
    //     });
    // }
    async function createOrder(itemId, quantity) {
        console.log("createOrder() called:", itemId, quantity);   // ← ADD THIS

        const order = await apiCreateOrder(itemId, quantity);

        console.log("Backend returned:", order);   // ← ADD THIS

        dispatch({
            type: "ORDER_CREATED",
            payload: order
        });
    }


    // -----------------------------------------------------------
    // payOrder()
    // Calls PaymentService → POST /payments
    // Then updates:
    // - payments list
    // - order status to "Paid"
    // -----------------------------------------------------------
    async function payOrder(orderId) {
        const payment = await apiPayOrder(orderId);

        dispatch({
            type: "ORDER_PAID",
            payload: payment
        });
    }


    async function getOrderById(orderId) {
        const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
        return res.json();
    }


    // -----------------------------------------------------------
    // Expose state + service functions to all components
    // -----------------------------------------------------------
    const value = {
        inventory: state.inventory,
        orders: state.orders,
        payments: state.payments,
        createOrder,
        payOrder
    };

    return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

// -------------------------------------------------------------
// useApi()
// Custom hook for consuming the ApiContext
// Makes calling services easy inside components
// -------------------------------------------------------------
export function useApi() {
    return useContext(ApiContext);
}




// import React, { createContext, useContext, useReducer } from "react";

// const ApiContext = createContext();

// const initialState = {
//   inventory: [
//     { id: 1, name: "Laptop", stock: 5, price: 1500 },
//     { id: 2, name: "Mouse", stock: 20, price: 25 }
//   ],
//   orders: [],
//   payments: []
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "CREATE_ORDER": {
//       const item = state.inventory.find(i => i.id === action.payload.itemId);
//       if (!item || item.stock < action.payload.quantity) return state;

//       const updatedInventory = state.inventory.map(i =>
//         i.id === item.id ? { ...i, stock: i.stock - action.payload.quantity } : i
//       );

//       const newOrder = {
//         id: state.orders.length + 1,
//         itemId: item.id,
//         quantity: action.payload.quantity,
//         total: item.price * action.payload.quantity,
//         status: "PendingPayment"
//       };

//       return {
//         ...state,
//         inventory: updatedInventory,
//         orders: [...state.orders, newOrder]
//       };
//     }

//     case "PAY_ORDER": {
//       const order = state.orders.find(o => o.id === action.payload.orderId);
//       if (!order || order.status === "Paid") return state;

//       const updatedOrders = state.orders.map(o =>
//         o.id === order.id ? { ...o, status: "Paid" } : o
//       );

//       const newPayment = {
//         id: state.payments.length + 1,
//         orderId: order.id,
//         amount: order.total
//       };

//       return {
//         ...state,
//         orders: updatedOrders,
//         payments: [...state.payments, newPayment]
//       };
//     }

//     default:
//       return state;
//   }
// }

// export function ApiProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const value = {
//     inventory: state.inventory,
//     orders: state.orders,
//     payments: state.payments,
//     createOrder: (itemId, quantity) =>
//       dispatch({ type: "CREATE_ORDER", payload: { itemId, quantity } }),
//     payOrder: orderId =>
//       dispatch({ type: "PAY_ORDER", payload: { orderId } })
//   };

//   return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
// }

// export function useApi() {
//   return useContext(ApiContext);
// }




// function ApiContext() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default ApiContext;