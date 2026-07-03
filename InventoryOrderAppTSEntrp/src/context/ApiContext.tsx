import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

// -------------------------------------------------------------
// Shared domain models (DTOs + frontend state)
// Enterprise-grade: single source of truth for types
//introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// -------------------------------------------------------------
import type { InventoryItem, OrderItem, PaymentItem } from "../models/dtoModels";

// -------------------------------------------------------------
// Inventory / Order / Payment Services (enterprise‑grade)
// -------------------------------------------------------------
import { getInventory } from "../httpServices/inventoryService";
import { getOrders, createOrder as apiCreateOrder } from "../httpServices/orderService";
import { getPayments, payOrder as apiPayOrder } from "../httpServices/paymentService";

import { ORDER_BASE } from "../api/apiClient";


// -------------------------------------------------------------
// TypeScript type for global state
// -------------------------------------------------------------
interface ApiState {
    inventoryItems: InventoryItem[];            // renamed from "inventory"
    orders: OrderItem[];
    payments: PaymentItem[];
}

// -------------------------------------------------------------
// TypeScript type for reducer actions
// -------------------------------------------------------------
type Action =
    | { type: "LOAD_DATA"; payload: ApiState }
    | { type: "ORDER_CREATED"; payload: OrderItem }
    | { type: "ORDER_PAID"; payload: PaymentItem };


// -------------------------------------------------------------
// Create the React Context container
// This is the global “service container” for your frontend
// -------------------------------------------------------------
interface ApiContextValue {
    inventoryItems: InventoryItem[];        // renamed from "inventory"
    orders: OrderItem[];
    payments: PaymentItem[];
    createOrder: (itemId: number, quantity: number) => Promise<void>;
    payOrder: (orderId: number, amount: number) => Promise<void>;
    getOrderById: (orderId: number) => Promise<OrderItem>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);


// -------------------------------------------------------------
// Initial global state for the reducer
// -------------------------------------------------------------
const initialState: ApiState = {
    inventoryItems: [],                      // renamed from "inventory"
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
                inventoryItems: action.payload.inventoryItems,   // renamed from "inventory",             
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
// loadData() — fetches all microservice data on startup
// Called once inside useEffect()
// -------------------------------------------------------------
async function loadData(dispatch: React.Dispatch<Action>) {

    console.log("🔥 loadData() fired");
    const inventoryItems = await getInventory();            // renamed from "inventory"
    console.log("🔥 inventory fetched:", inventoryItems);   // renamed from "inventory"

    const orders = await getOrders();
    const payments = await getPayments();

    dispatch({
        type: "LOAD_DATA",
        payload: { inventoryItems, orders, payments }       // renamed from "inventory"
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

    async function getOrderById(orderId: number): Promise<OrderItem> {
        const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
        return res.json();
    }

    const value: ApiContextValue = {
        inventoryItems: state.inventoryItems,               // renamed from "inventory"
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



