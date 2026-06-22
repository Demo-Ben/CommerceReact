// In short — ApiContext.jsx is:
//      Your front‑end microservice orchestrator
//      Your global state manager
//      Your API gateway(client - side)
//      Your single source of truth
//      Your service container
//      Your React - wide dependency injector

// What ApiContext.jsx is
// ApiContext is your front‑end service container.
// It centralizes:
//  Shared state(inventory, orders, payments)
//  API calls(createOrder, payOrder, getOrderById)
//  Data loading on startup
//  State updates through a reducer
//  A single source of truth for all pages

// Why your app NEEDS ApiContext
// Without ApiContext:
//  Each page would fetch its own data
//  You’d have duplicated logic
//  State would be inconsistent
//  Payments wouldn’t update Orders
//  Orders wouldn’t update Inventory
//  You’d have race conditions
//  You’d have stale UI everywhere


import React, { createContext, useContext, useReducer, useEffect } from "react";

// -------------------------------------------------------------
// apiClient.js — low‑level HTTP functions + base URLs
// -------------------------------------------------------------
import {
    getInventory,
    getOrders,
    getPayments,
    createOrder as apiCreateOrder,
    payOrder as apiPayOrder,
    ORDER_BASE
} from "../api/apiClient";
//import { ORDER_BASE } from "../api/apiClient";



// -------------------------------------------------------------
// Create the React Context container
// This is the global “service container” for your frontend
// -------------------------------------------------------------
const ApiContext = createContext();


// -------------------------------------------------------------
// Initial global state for the reducer
// -------------------------------------------------------------
const initialState = {
    // inventory: [
    //     { id: 1, name: "Laptop", stock: 5, price: 1500 },
    //     { id: 2, name: "Mouse", stock: 20, price: 25 }
    // ],
    inventory: [],
    orders: [],
    payments: []
};


// -------------------------------------------------------------
// Reducer — centralised state transitions
// Every API action updates state through here
// -------------------------------------------------------------
function reducer(state, action) {
    switch (action.type) {

        // Load all microservice data on startup
        case "LOAD_DATA":
            return {
                ...state,
                inventory: action.payload.inventory,
                orders: action.payload.orders,
                payments: action.payload.payments
            };


        // Fired after POST /orders returns a new order
        case "ORDER_CREATED":
            return {
                ...state,
                orders: [...state.orders, action.payload]
            };


        // Fired after POST /payments returns a payment record
        // Also updates the order status to "Paid"
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
// loadData() — fetches all microservice data on startup
// Called once inside useEffect()
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
// ApiProvider — wraps the entire React app
// Provides global state + service functions to all pages
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


    // ---------------------------------------------------------
    // createOrder() — POST /orders
    // Creates a new order and updates global state
    // ---------------------------------------------------------
    async function createOrder(itemId, quantity) {
        console.log("createOrder() called:", itemId, quantity);   // ← ADD THIS

        const order = await apiCreateOrder(itemId, quantity);

        console.log("Backend returned:", order);   // ← ADD THIS

        dispatch({
            type: "ORDER_CREATED",
            payload: order
        });
    }


    // ---------------------------------------------------------
    // payOrder() — POST /payments
    // IMPORTANT: must accept BOTH orderId + amount
    // This is what fixes the “amount = 0” bug
    // ---------------------------------------------------------
    async function payOrder(orderId, amount) {
        const payment = await apiPayOrder(orderId, amount);

        dispatch({
            type: "ORDER_PAID",
            payload: payment
        });
    }


    // ---------------------------------------------------------
    // getOrderById() — GET /orders/{id}
    // Used by PaymentPage “Pay Again” to fetch the correct total
    // ---------------------------------------------------------
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
        payOrder,
        getOrderById
    };

    return <ApiContext.Provider value={value}>
                {children}
            </ApiContext.Provider>;
}

// -------------------------------------------------------------
// useApi() — custom hook for consuming ApiContext
// Lets pages call createOrder(), payOrder(), etc.
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