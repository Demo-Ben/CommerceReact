// The architecture in one clean diagram
// ************************************
// main.jsx or index.jsx
//     ↓
// apiClient.js
//     ↓
// Defines HTTP service functions
//     ↓
// ApiContext.jsx
//     ↓
// Loads services + injects them into the app
//     ↓
// Provides global state + actions
//     ↓
// React pages
//     ↓
// GUI + consumers of injected services


// Visual flow of your app
// ***********************************
// Index.html  ← static HTML file to host main.jsx
//        ↓
// <div id="root"></div>
//         ↓
// main.jsx  ← React entry point
//         ↓
// <ApiProvider>  ← loads global state + services DI container
//         ↓
//   <App>        ← your root UI
//         ↓
// Pages (OrderPage, PaymentPage, etc.)
//         ↓
//  useApi()  ← access to global state + service functions
//         ↓
//  apiClient.js  ← HTTP service layer
//         ↓
//  Backend microservices


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
    // onsole.log("🔥 loadData() fired");
    const inventory = await getInventory();
    // console.log("🔥 inventory fetched:", inventory);

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


