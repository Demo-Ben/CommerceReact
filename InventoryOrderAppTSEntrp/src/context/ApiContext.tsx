
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
// This interface defines what your entire application stores in memory inside the React Context.
// This is your frontend database — the in‑memory state that all pages read from.
//
// .NET equivalent: a singleton service that stores the same data in memory for all pages to read from.
//  public class GlobalState {
//     public List <InventoryDto> Inventorys { get; set; }
//     public List <OrderDto > Orders { get; set; }
//     public List <PaymentDto > Payments { get; set; }
//  }
// -------------------------------------------------------------
interface ApiState {
    inventorys: dtoInventory[];             
    orders: dtoOrder[];
    payments: dtoPayment[];
}

// -------------------------------------------------------------
// TypeScript type for reducer actions
// This defines every possible state change your app can perform.
// These are instructions telling the reducer how to update the global state.
//
// .NET equivalent: a set of methods on a singleton service that update the in-memory state.
//                  This is like commands in CQRS (Command Query Responsibility Segregation) pattern:
// public record LoadData(GlobalState State);
// public record OrderCreated(OrderDto Order);
// public record OrderPaid(PaymentDto Payment);
// -------------------------------------------------------------
type Action =
    | { type: "LOAD_DATA"; payload: ApiState }
    | { type: "ORDER_CREATED"; payload: dtoOrder }
    | { type: "ORDER_PAID"; payload: dtoPayment };


// -------------------------------------------------------------
// Create the React Context container
// This is the global “service container” for your front end
//
// This interface defines what your entire app can access through useApi().
// This is your front end service container — the functions and data exposed to all pages.
//
// .NET equivalent: a singleton service that exposes the same functions and data to all pages.
//                  This is like registering services in DI:
// services.AddScoped<IOrderService, OrderService>();
// services.AddScoped<IPaymentService, PaymentService>();
// services.AddScoped<IInventoryService, InventoryService>();
// -------------------------------------------------------------
interface ApiContextValue {
    inventorys: dtoInventory[];        
    orders: dtoOrder[];
    payments: dtoPayment[];
    createOrder: (itemId: number, quantity: number) => Promise<void>;
    payOrder: (orderId: number, amount: number) => Promise<void>;
    getOrderById: (orderId: number) => Promise<dtoOrder>;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

// -------------------------------------------------------------
// Initial global state for the reducer
// This defines the initial empty state before data is loaded.
// our app starts with no data until loadData() runs.

// .NET equivalent:
// var state = new GlobalState {
//     Inventorys = new (),
//     Orders = new (),
//     Payments = new ()
// };
// -------------------------------------------------------------
const initialState: ApiState = {
    inventorys: [],                       
    orders: [],
    payments: []
};

// - Workflow -
// **********
// App starts
// → initialState is loaded.
// → loadData() runs → loadData() fetches all data
// → dispatch() sends "LOAD_DATA" action : dispatch({ type: "LOAD_DATA", payload: { inventorys, orders, payments } });
// → reducer updates state →  case "LOAD_DATA":
//                                  return { ...state, inventorys, orders, payments
//                                  all pages re - render with new data
// → ApiContextValue exposes updated state:  const { inventorys, orders, payments } = useApi();


// -------------------------------------------------------------
// Reducer — centralized state transitions
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



