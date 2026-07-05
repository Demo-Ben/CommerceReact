
// Clean architecture mapping(React → .NET)
// -------------------------------------------------------------
// Layer	                    React                                       .NET
// Startup bootstrap	    loadData() inside useEffect()	    Program.cs / Startup.cs
// Dependency injection     <ApiProvider>                       services.AddScoped()
// Global state	            useReducer()	                    Singleton / Scoped services
// Transport layer	        httpServices	                    HttpClient / API services
// DTOs	                    dtoModels.ts	                    OrderDto.cs
// -------------------------------------------------------------

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
// 1. createContext — creates a global container for shared data
//      Example: const MyContext = createContext<MyContextType | undefined>(undefined);
// 2. useContext — reads from a context
//      Example: const ctx = useContext(MyContext);
// 3. useReducer — manages complex state with actions
//      Example: const [state, dispatch] = useReducer(reducer, initialState);
// 4. useEffect — runs side effects (fetching, subscriptions, timers)
//      Example: useEffect(() => { fetchData(); }, []);

import { ORDER_BASE } from "../api/apiClient";
import type { dtoInventory, dtoOrder, dtoPayment } from "../models/dtoModels";
import { getInventory } from "../httpServices/inventoryService";
import { getOrders, createOrder as apiCreateOrder } from "../httpServices/orderService";
import { getPayments, payOrder as apiPayOrder } from "../httpServices/paymentService";

// Visual Summary (the order you should always follow)
// -------------------------------------------------------------
// 1. ApiState          ← defines the shape of global state
// 2. Action            ← defines allowed state transitions
// 3. ApiContextValue   ← defines what the app can access
// 4. initialState      ← defines the starting state
// (NEW)
// 5. Loading/Error State (optional but enterprise-grade)
// 6. Selectors (optional)
// 7. Refresh-all function (optional)


// -------------------------------------------------------------
// The full correct code order is:
// -------------------------------------------------------------
// 1.Imports
// 2.DTO imports
// 3.ApiState
// 4.Action
// 5.ApiContextValue
// 6.createContext
// 7.initialState
// 8.reducer
// 9.internal helper functions(loadData, etc.)
// 10.ApiProvider
// 11.useApi


// - Workflow -
// -------------------------------------------------------------
// Browser loads index.html
// ↓
// main.tsx runs ReactDOM.createRoot()
// ↓
// <ApiProvider> wraps <App />
// ↓
// ApiProvider initializes state with useReducer(initialState)
// ↓
// ApiProvider runs useEffect → loadData()
// ↓
// loadData() fetches inventory, orders, payments
// ↓
// loadData() dispatches {type: "LOAD_DATA", payload: {...} }
// ↓
// Reducer handles LOAD_DATA → updates global state
// ↓
// ApiProvider re-renders → ApiContext.Provider supplies updated state
// ↓
// Pages re-render → useContext(ApiContext) returns new inventorys, orders, payments
// ↓
// UI updates with fresh data


// ┌──────────────────────────────────────────────┐
// │                Browser loads                 │
// │                index.html                    │
// │        <div id="root"></div>                 │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │        ReactDOM.createRoot() runs            │
// │        (main.tsx entry point)                │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │        <ApiProvider> wraps <App />           │
// │  (start of global state + data architecture) │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider initializes reducer state       │
// │   const [state, dispatch] = useReducer(...)   │
// │   → initialState loaded                       │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider useEffect() fires once          │
// │   useEffect(() => loadData(dispatch), [])     │
// │   → loadData() begins startup fetch           │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   loadData() calls service layer              │
// │   → getInventory()                            │
// │   → getOrders()                               │
// │   → getPayments()                             │
// │   (backend JSON → DTO mapping)                │
// └──────────────────────────────────────────────┘
//                       ↓
// ┌──────────────────────────────────────────────┐
// │   loadData() dispatches LOAD_DATA action      │
// │   dispatch({                                  │
// │     type: "LOAD_DATA",                        │
// │     payload: {inventorys, orders, payments}   │
// │   })                                          │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   Reducer receives LOAD_DATA                  │
// │   case "LOAD_DATA":                           │
// │       return {...state, inventorys, orders,   │
// │                payments }                     │
// │   → global state updated                      │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider re-renders                      │
// │   ApiContext.Provider supplies new value      │
// │   const value: ApiContextValue = {            │
// │       inventorys, orders, payments,           │
// │       createOrder, payOrder                   │
// │   }                                           │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   Pages re-render                             │
// │   Components call useContext(ApiContext)      │
// │   const {inventorys, orders, payments} =     │
// │         useApi();                             │
// │   → UI updates with fresh data                │
// └──────────────────────────────────────────────┘



// -------------------------------------------------------------
// 1. ApiState — the global state shape
// -------------------------------------------------------------
// This interface defines
//            what your entire application stores in memory inside the React Context.
//            your frontend database — the in‑memory state that all pages read from.
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
// 5. (NEW) Loading + Error State — enterprise-grade addition
//
// These states are NOT part of ApiState because they are not domain data.
// They represent UI state about the API calls.
//
// .NET equivalent: a singleton service that stores the same data in memory for all pages to read from.
// -------------------------------------------------------------
interface ApiMetaState {
    isLoading: boolean;      // true while loadData() is running
    error?: string;          // set if any API call fails
}

// -------------------------------------------------------------
// 2. Action — the reducer’s “commands”
// it is for reducer actions
//      This defines every possible state change your app can perform.
//      These are instructions telling the reducer how to update the global state.
//
// .NET equivalent: a set of methods on a singleton service that update the in-memory state.
//                  This is like commands in CQRS (Command Query Responsibility Segregation) pattern:
// public record LoadData(GlobalState State);
// public record OrderCreated(OrderDto Order);
// public record OrderPaid(PaymentDto Payment);

// -------------------------------------------------------------
// Hi reducer,
// I’m sending you a LOAD_DATA action.
// Here is the full ApiState (inventorys, orders, payments).Please update the global state with this data.”
//
// Define a TYPE called Action, and this type can be one of several shapes.
// Each shape is an object with a "type" property and a "payload" property.
// 3 shapes for now, but we can add more later.
// Why just 3 shapes? Because we only have 3 actions right now: LOAD_DATA, ORDER_CREATED, ORDER_PAID.
type Action =
    | { type: "LOAD_DATA"; payload: ApiState }   
    | { type: "ORDER_CREATED"; payload: dtoOrder }
    | { type: "ORDER_PAID"; payload: dtoPayment }
    | { type: "SET_LOADING"; payload: boolean }             // NEW  
    | { type: "SET_ERROR"; payload: string | undefined };   // NEW;


// -------------------------------------------------------------
// 3. ApiContextValue — the public API of your frontend
// -------------------------------------------------------------
// Create the React Context container
//      This is the global “service container” for your front end
//      This interface defines what your entire app can access through useApi().
//      This is your front end service container — the functions and data exposed to all pages.
//
// .NET equivalent: a singleton service that exposes the same functions and data to all pages.
//                  This is like registering services in DI:
//      services.AddScoped<IOrderService, OrderService>();
//      services.AddScoped<IPaymentService, PaymentService>();
//      services.AddScoped<IInventoryService, InventoryService>();
// -------------------------------------------------------------
interface ApiContextValue {
    inventorys: dtoInventory[];
    orders: dtoOrder[];
    payments: dtoPayment[];

    // NEW — meta state exposed to UI
    isLoading: boolean;
    error?: string;

    // service functions
    createOrder: (itemId: number, quantity: number) => Promise<void>;
    payOrder: (orderId: number, amount: number) => Promise<void>;
    getOrderById: (orderId: number) => Promise<dtoOrder>;

    // NEW — refresh-all function
    refreshAll: () => Promise<void>;
}

// Notes: calling a React function "createContext" to create a new context object for the API", 
// this context will store either ApiContextValue or undefine
const ApiContext = createContext<ApiContextValue | undefined>(undefined);

// -------------------------------------------------------------
// 4. initialState — the starting point
// -------------------------------------------------------------
// Initial global state for the reducer
// This defines the initial empty state before data is loaded.
// our app starts with no data until loadData() runs.

// .NET equivalent:
//      var state = new GlobalState {
//          Inventorys = new (),
//          Orders = new (),
//          Payments = new ()
//       };
//
// const something: SomeInterface = {
//      id: 1,
//      name: "Laptop",
//      stock: 5
// };

// const        → JavaScript variable declaration
// something    → variable name
// : SomeInterface → TypeScript type annotation
// = { ... }    → actual JavaScript object value
// -------------------------------------------------------------
const initialState: ApiState = {
    inventorys: [],
    orders: [],
    payments: []
};

// NEW — initial meta state
const initialMetaState: ApiMetaState = {
    isLoading: false,
    error: undefined
};

// -------------------------------------------------------------
// NEW Combined state (domain + meta)
//
// intersection interfaces: type Something = SomeInterface1 & SomeInterface2;
// union interfaces:        type Something = SomeInterface1 | SomeInterface2;
// -------------------------------------------------------------
type CombinedState = ApiState & ApiMetaState;

const initialCombinedState: CombinedState = {
    ...initialState,
    ...initialMetaState
};

// -------------------------------------------------------------
// Reducer — centralized state transitions
// Every API action updates state through here
// -------------------------------------------------------------
// function reducer(state: ApiState, action: Action): ApiState {
function reducer(state: CombinedState, action: Action): CombinedState {   //NEW — combined state type
    switch (action.type) {

        case "SET_LOADING":
            return { ...state, isLoading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        //“Reducer, I’m giving you fresh data (inventorys, orders, payments).
        // Replace the old data with this new data.
        // Also mark loading as finished and clear any errors.”
        case "LOAD_DATA":
            return {
                ...state,
                inventorys: action.payload.inventorys,
                orders: action.payload.orders,
                payments: action.payload.payments,
                isLoading: false,
                error: undefined
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

    try {
        // debugger; // <— THIRD BREAKPOINT

        dispatch({ type: "SET_LOADING", payload: true });

        console.log("🔥 loadData() fired");
        const inventorys = await getInventory();
        console.log("🔥 inventory fetched:", inventorys);

        const orders = await getOrders();
        console.log("🔥 order fetched:", orders);

        const payments = await getPayments();
        console.log("🔥 payment fetched:", payments);

        dispatch({
            type: "LOAD_DATA",
            payload: { inventorys, orders, payments }
        });

    } catch (err: any) {
        dispatch({ type: "SET_ERROR", payload: err.message ?? "Unknown error" });
    } finally {
        dispatch({ type: "SET_LOADING", payload: false });
    }
}


// -------------------------------------------------------------
// 7. (NEW) refreshAll() — enterprise-grade manual reload
// -------------------------------------------------------------
async function refreshAll(dispatch: React.Dispatch<Action>) {
    console.log("🔄 Manual refreshAll() triggered");
    await loadData(dispatch);
}


// -------------------------------------------------------------
// ApiProvider — wraps the entire React app
// Provides global state + service functions to all pages
// It’s a custom React component that wraps your app and provides context.
// -------------------------------------------------------------
export function ApiProvider({ children }: { children: ReactNode }) {
    // debugger; // <— FIRST BREAKPOINT

    //const [state, dispatch] = useReducer(reducer, initialState);
    const [state, dispatch] = useReducer(reducer, initialCombinedState);  //NEW — combined state

    // debugger; // <— SECOND BREAKPOINT
    console.log("STATE:", state);

    useEffect(() => {
        loadData(dispatch);
    }, []);

    async function createOrder(itemId: number, quantity: number) {

        console.log("🔥 createOrder() called:", itemId, quantity);
        const order = await apiCreateOrder(itemId, quantity);
        console.log("🔥 Backend returned:", order);

        dispatch({
            type: "ORDER_CREATED",
            payload: order
        });
    }

    async function payOrder(orderId: number, amount: number) {
        console.log("🔥 apiPayOrder() called:", orderId, amount);
        const payment = await apiPayOrder(orderId, amount);

        dispatch({
            type: "ORDER_PAID",
            payload: payment
        });
    }

    async function getOrderById(orderId: number): Promise<dtoOrder> {
        console.log("🔥 fetch() called:", orderId);
        const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
        return res.json();
    }

    const value: ApiContextValue = {
        inventorys: state.inventorys,
        orders: state.orders,
        payments: state.payments,

        // NEW meta state
        isLoading: state.isLoading,
        error: state.error,

        createOrder,
        payOrder,
        getOrderById,

        // NEW refresh-all
        refreshAll: () => refreshAll(dispatch)
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











// // Clean architecture mapping(React → .NET)
// // Layer	                    React                                       .NET
// // Startup bootstrap	    loadData() inside useEffect()	    Program.cs / Startup.cs
// // Dependency injection     <ApiProvider>                       services.AddScoped()
// // Global state	            useReducer()	                    Singleton / Scoped services
// // Transport layer	        httpServices	                    HttpClient / API services
// // DTOs	                    dtoModels.ts	                    OrderDto.cs

// import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";

// import { ORDER_BASE } from "../api/apiClient";

// // -------------------------------------------------------------
// // Shared domain models (DTOs + frontend state)
// // Enterprise-grade: single source of truth for types
// // introduced in TypeScript 3.8 and recommended in TypeScript 5+.
// // -------------------------------------------------------------
// import type { dtoInventory, dtoOrder, dtoPayment } from "../models/dtoModels";

// // -------------------------------------------------------------
// // Inventory / Order / Payment Services (enterprise‑grade)
// // -------------------------------------------------------------
// import { getInventory } from "../httpServices/inventoryService";
// import { getOrders, createOrder as apiCreateOrder } from "../httpServices/orderService";
// import { getPayments, payOrder as apiPayOrder } from "../httpServices/paymentService";


// // -------------------------------------------------------------
// // TypeScript type for global state
// // This interface defines what your entire application stores in memory inside the React Context.
// // This is your frontend database — the in‑memory state that all pages read from.
// //
// // .NET equivalent: a singleton service that stores the same data in memory for all pages to read from.
// //  public class GlobalState {
// //     public List <InventoryDto> Inventorys { get; set; }
// //     public List <OrderDto > Orders { get; set; }
// //     public List <PaymentDto > Payments { get; set; }
// //  }
// // -------------------------------------------------------------
// interface ApiState {
//     inventorys: dtoInventory[];             
//     orders: dtoOrder[];
//     payments: dtoPayment[];
// }

// // -------------------------------------------------------------
// // TypeScript type for reducer actions
// // This defines every possible state change your app can perform.
// // These are instructions telling the reducer how to update the global state.
// //
// // .NET equivalent: a set of methods on a singleton service that update the in-memory state.
// //                  This is like commands in CQRS (Command Query Responsibility Segregation) pattern:
// // public record LoadData(GlobalState State);
// // public record OrderCreated(OrderDto Order);
// // public record OrderPaid(PaymentDto Payment);
// // -------------------------------------------------------------
// type Action =
//     | { type: "LOAD_DATA"; payload: ApiState }
//     | { type: "ORDER_CREATED"; payload: dtoOrder }
//     | { type: "ORDER_PAID"; payload: dtoPayment };


// // -------------------------------------------------------------
// // Create the React Context container
// // This is the global “service container” for your front end
// //
// // This interface defines what your entire app can access through useApi().
// // This is your front end service container — the functions and data exposed to all pages.
// //
// // .NET equivalent: a singleton service that exposes the same functions and data to all pages.
// //                  This is like registering services in DI:
// // services.AddScoped<IOrderService, OrderService>();
// // services.AddScoped<IPaymentService, PaymentService>();
// // services.AddScoped<IInventoryService, InventoryService>();
// // -------------------------------------------------------------
// interface ApiContextValue {
//     inventorys: dtoInventory[];        
//     orders: dtoOrder[];
//     payments: dtoPayment[];
//     createOrder: (itemId: number, quantity: number) => Promise<void>;
//     payOrder: (orderId: number, amount: number) => Promise<void>;
//     getOrderById: (orderId: number) => Promise<dtoOrder>;
// }

// const ApiContext = createContext<ApiContextValue | undefined>(undefined);

// // -------------------------------------------------------------
// // Initial global state for the reducer
// // This defines the initial empty state before data is loaded.
// // our app starts with no data until loadData() runs.

// // .NET equivalent:
// // var state = new GlobalState {
// //     Inventorys = new (),
// //     Orders = new (),
// //     Payments = new ()
// // };
// // -------------------------------------------------------------
// const initialState: ApiState = {
//     inventorys: [],                       
//     orders: [],
//     payments: []
// };

// // - Workflow -
// // **********
// // App starts
// // → initialState is loaded.
// // → loadData() runs → loadData() fetches all data
// // → dispatch() sends "LOAD_DATA" action : dispatch({ type: "LOAD_DATA", payload: { inventorys, orders, payments } });
// // → reducer updates state →  case "LOAD_DATA":
// //                                  return { ...state, inventorys, orders, payments
// //                                  all pages re - render with new data
// // → ApiContextValue exposes updated state:  const { inventorys, orders, payments } = useApi();


// // -------------------------------------------------------------
// // Reducer — centralized state transitions
// // Every API action updates state through here
// // -------------------------------------------------------------
// function reducer(state: ApiState, action: Action): ApiState {
//     switch (action.type) {

//         case "LOAD_DATA":
//             return {
//                 ...state,
//                 inventorys: action.payload.inventorys,                 
//                 orders: action.payload.orders,
//                 payments: action.payload.payments
//             };

//         case "ORDER_CREATED":
//             return {
//                 ...state,
//                 orders: [...state.orders, action.payload]
//             };

//         case "ORDER_PAID":
//             return {
//                 ...state,
//                 payments: [...state.payments, { ...action.payload, status: "Paid" }],
//                 orders: state.orders.map(o =>
//                     o.id === action.payload.orderId
//                         ? { ...o, status: "Paid" }
//                         : o
//                 )
//             };

//         default:
//             return state;
//     }
// }


// // -------------------------------------------------------------
// // loadData() — fetches all Microservices data on startup
// // Called once inside useEffect()
// // -------------------------------------------------------------
// async function loadData(dispatch: React.Dispatch<Action>) {

//     console.log("🔥 loadData() fired");
//     const inventorys = await getInventory();             
//     console.log("🔥 inventory fetched:", inventorys);   

//     const orders = await getOrders();
//     const payments = await getPayments();

//     dispatch({
//         type: "LOAD_DATA",
//         payload: { inventorys, orders, payments }       
//     });
// }


// // -------------------------------------------------------------
// // ApiProvider — wraps the entire React app
// // Provides global state + service functions to all pages
// // -------------------------------------------------------------
// export function ApiProvider({ children }: { children: ReactNode }) {
//     const [state, dispatch] = useReducer(reducer, initialState);

//     useEffect(() => {
//         loadData(dispatch);
//     }, []);

//     async function createOrder(itemId: number, quantity: number) {
//         console.log("createOrder() called:", itemId, quantity);

//         const order = await apiCreateOrder(itemId, quantity);

//         console.log("Backend returned:", order);

//         dispatch({
//             type: "ORDER_CREATED",
//             payload: order
//         });
//     }

//     async function payOrder(orderId: number, amount: number) {
//         const payment = await apiPayOrder(orderId, amount);

//         dispatch({
//             type: "ORDER_PAID",
//             payload: payment
//         });
//     }

//     async function getOrderById(orderId: number): Promise<dtoOrder> {
//         const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
//         return res.json();
//     }

//     const value: ApiContextValue = {
//         inventorys: state.inventorys,                
//         orders: state.orders,
//         payments: state.payments,
//         createOrder,
//         payOrder,
//         getOrderById
//     };

//     return (
//         <ApiContext.Provider value={value}>
//             {children}
//         </ApiContext.Provider>
//     );
// }


// // -------------------------------------------------------------
// // useApi() — custom hook for consuming ApiContext
// // Lets pages call createOrder(), payOrder(), etc.
// // -------------------------------------------------------------
// export function useApi(): ApiContextValue {
//     const ctx = useContext(ApiContext);
//     if (!ctx) throw new Error("useApi must be used inside ApiProvider");
//     return ctx;
// }



