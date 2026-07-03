
// Clean architecture mapping(React → .NET)
// Layer	                    React                                       .NET
// Startup bootstrap	    loadData() inside useEffect()	    Program.cs / Startup.cs
// Dependency injection     <ApiProvider>                       services.AddScoped()
// Global state	            useReducer()	                    Singleton / Scoped services
// Transport layer	        httpServices	                    HttpClient / API services
// DTOs	                    dtoModels.ts	                    OrderDto.cs

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

import { ORDER_BASE } from "../api/apiClient";

// -------------------------------------------------------------
// Shared domain models (DTOs + frontend state)
// Enterprise-grade: single source of truth for types
// introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { dtoInventory, dtoOrder, dtoPayment } from "../models/dtoModels";

// -------------------------------------------------------------
// Inventory / Order / Payment Services (enterprise‑grade)
// -------------------------------------------------------------
import { getInventory } from "../httpServices/inventoryService";
import { getOrders, createOrder as apiCreateOrder } from "../httpServices/orderService";
import { getPayments, payOrder as apiPayOrder } from "../httpServices/paymentService";

// -------------------------------------------------------------
// TypeScript type for global state
// -------------------------------------------------------------
interface ApiState {
    inventorys: dtoInventory[];             
    orders: dtoOrder[];
    payments: dtoPayment[];
}

// -------------------------------------------------------------
// TypeScript type for reducer actions
// -------------------------------------------------------------
type Action =
    | { type: "LOAD_DATA"; payload: ApiState }
    | { type: "ORDER_CREATED"; payload: dtoOrder }
    | { type: "ORDER_PAID"; payload: dtoPayment };


// -------------------------------------------------------------
// Create the React Context container
// This is the global “service container” for your frontend
// -------------------------------------------------------------
interface ApiContextValue {
    inventorys: dtoInventory[];        // renamed from "inventory"
    orders: dtoOrder[];
    payments: dtoPayment[];
    createOrder: (itemId: number, quantity: number) => Promise<void>;
    payOrder: (orderId: number, amount: number) => Promise<void>;
    getOrderById: (orderId: number) => Promise<dtoOrder>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);


// -------------------------------------------------------------
// Initial global state for the reducer
// -------------------------------------------------------------
const initialState: ApiState = {
    inventorys: [],                       
    orders: [],
    payments: []
};


// -------------------------------------------------------------
// Reducer — centralised state transitions
// Every API action updates state through here
// -------------------------------------------------------------
function reducer(state: ApiState, action: Action): ApiState {
    switch (action.type) {

        case "LOAD_DATA":
            return {
                ...state,
                inventorys: action.payload.inventorys,                 
                orders: action.payload.orders,
                payments: action.payload.payments
            };

        case "ORDER_CREATED":
            return {
                ...state,
                orders: [...state.orders, action.payload]
            };

        case "ORDER_PAID":
            return {
                ...state,
                payments: [...state.payments, { ...action.payload, status: "Paid" }],
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
// loadData() — fetches all Microservices data on startup
// Called once inside useEffect()
// -------------------------------------------------------------
async function loadData(dispatch: React.Dispatch<Action>) {

    console.log("🔥 loadData() fired");
    const inventorys = await getInventory();             
    console.log("🔥 inventory fetched:", inventorys);   

    const orders = await getOrders();
    const payments = await getPayments();

    dispatch({
        type: "LOAD_DATA",
        payload: { inventorys, orders, payments }       
    });
}


// -------------------------------------------------------------
// ApiProvider — wraps the entire React app
// Provides global state + service functions to all pages
// -------------------------------------------------------------
export function ApiProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        loadData(dispatch);
    }, []);

    async function createOrder(itemId: number, quantity: number) {
        console.log("createOrder() called:", itemId, quantity);

        const order = await apiCreateOrder(itemId, quantity);

        console.log("Backend returned:", order);

        dispatch({
            type: "ORDER_CREATED",
            payload: order
        });
    }

    async function payOrder(orderId: number, amount: number) {
        const payment = await apiPayOrder(orderId, amount);

        dispatch({
            type: "ORDER_PAID",
            payload: payment
        });
    }

    async function getOrderById(orderId: number): Promise<dtoOrder> {
        const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
        return res.json();
    }

    const value: ApiContextValue = {
        inventorys: state.inventorys,                
        orders: state.orders,
        payments: state.payments,
        createOrder,
        payOrder,
        getOrderById
    };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}


// -------------------------------------------------------------
// useApi() — custom hook for consuming ApiContext
// Lets pages call createOrder(), payOrder(), etc.
// -------------------------------------------------------------
export function useApi(): ApiContextValue {
    const ctx = useContext(ApiContext);
    if (!ctx) throw new Error("useApi must be used inside ApiProvider");
    return ctx;
}



