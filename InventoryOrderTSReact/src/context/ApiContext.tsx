// Clean architecture mapping(React → .NET)
// --------------------------------------------------------------------------------------
//    Layer	                    React                                     .NET
// Startup bootstrap	    loadData() inside useEffect()	    Program.cs / Startup.cs
// Dependency injection     <ApiProvider>                       services.AddScoped()
// Global state	            useReducer()	                    Singleton / Scoped services
// Transport layer	        httpServices	                    HttpClient / API services
// DTOs	                    dtoModels.ts	                    OrderDto.cs
// ---------------------------------------------------------------------------------------

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
// │              Browser loads                   │
// │                index.html                    │
// │           <div id="root"></div>              │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │        ReactDOM.createRoot() runs            │
// │          (main.tsx entry point)              │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │        <ApiProvider> wraps <App />           │
// │  (start of global state + data architecture) │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider initializes reducer state      │
// │   const [state, dispatch] = useReducer(...)  │
// │   → initialState loaded                      │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider useEffect() fires once         │
// │   useEffect(() => loadData(dispatch), [])    │
// │   → loadData() begins startup fetch          │
// └──────────────────────────────────────────────┘
//                          ↓
// ┌──────────────────────────────────────────────┐
// │   loadData() calls service layer             │
// │     → getInventory()                         │
// │     → getOrders()                            │
// │     → getPayments()                          │
// │   (backend JSON → DTO mapping)               │
// └──────────────────────────────────────────────┘
//                       ↓
// ┌──────────────────────────────────────────────┐
// │   loadData() dispatches LOAD_DATA action     │
// │     dispatch({                               │
// │      type: "LOAD_DATA",                      │
// │      payload: {inventorys, orders, payments} │
// │     })                                       │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   Reducer receives LOAD_DATA                 │
// │     case "LOAD_DATA":                        │
// │        return {...state, inventorys,         │
// │                  orders, payments            │
// │   → global state updated                     │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   ApiProvider re-renders                     │
// │   ApiContext.Provider supplies new value     │
// │   const value: ApiContextValue = {           │
// │       inventorys, orders, payments,          │
// │       createOrder, payOrder                  │
// │   }                                          │
// └──────────────────────────────────────────────┘
//                      ↓
// ┌──────────────────────────────────────────────┐
// │   Pages re-render                            │
// │   Components call useContext(ApiContext)     │
// │   const {inventorys, orders, payments} =     │
// │         useApi();                            │
// │   → UI updates with fresh data               │
// └──────────────────────────────────────────────┘


// -------------------------------------------------------------
// Unified Correct Order for ApiContext.tsx
// -------------------------------------------------------------
// 1. Imports -  React, hooks, services, constants, utilities
//               → Required before anything else.
// 2. DTO Imports
//      Your backend DTO models
//      → Needed before defining state shape.
// 3. ApiState
//      Defines the global data structure stored in Context.
// 4. ApiMetaState(optional but recommended)
//      Loading + error status block.
// 5. Action
//      Union type describing all reducer transitions.
// 6. ApiContextValue
//      Defines what the app can read + call from the context.
// 7. createContext
//      Creates the DI container typed with ApiContextValue.
// 8. initialState
//      Starting values for ApiState + optional ApiMetaState.
// 9. reducer
//      Pure function handling all Action transitions.
// 10. Selectors(optional)
//      Derived data helpers(e.g., selectPaidOrders).
// 11. Internal helper functions
//      loadData, refreshAll, API wrappers, etc.
// 12. ApiProvider
//      Runs useReducer, useEffect, loads data, exposes context.
// 13. useApi
//      Custom hook returning the context value.


//Terms you are using in this file
// 1. React Context API - const ApiContext = createContext<ApiContextValue | undefined>(undefined);
// 2. useReducer — Centralized State Machine - const [state, dispatch] = useReducer(fnReducer, initialCombinedState);
// 3. Action Union Types (TypeScript Discriminated Unions) - type Action =  | { type: "LOAD_DATA"; payload: ApiState } |
// 4. Combined State (Domain + Meta State) - type CombinedState = ApiState & ApiMetaState
// 5. useEffect — Startup Data Loading - useEffect(() => { fnloadData(dispatch); }, []);
// 6. Async Service Layer (HTTP Services)
// 7. Internal Async Actions (thunks) - import * as inventoryService from "../httpServices/inventoryService";
// 8. Selectors - export function selectInventoryById(state: CombinedState, id: number) {return state.inventorys.find(i => i.id === id); }
// 9. Context Provider Component - <ApiContext.Provider value={value}>  {children} </ApiContext.Provider>
// 10. Custom Hook (useApi) - export function useApi(): ApiContextValue { }
// 11. Immutable State Updates - orders: [...state.orders, action.payload]
// 12. Enterprise Architecture Patterns = Redux, NgRx, CQRS, DI, Singleton Services, Service layers, DTOs, Selector architecture, Global State Management

// -------------------------------------------------------------
// 1. Imports (react JavaScript library) - React, hooks, services, constants, utilities
//
// createContext:   React API Function      Creates the context container
// useContext:      React Hook              Reads data from a context container
// useReducer:      React Hook              Manages complex component state (both ApiState and ApiMetaState )
// useEffect:       React Hook              Handles side effects (APIs, timers)
// ReactNode        TypeScript Type         Describes anything React can render
//
// 1. createContext — it is factory machine, it can return what you request. Creates a global container for shared data
//      Example: const ApiContext = createContext<ApiContextValue | undefined>(undefined);
//      Example: const AuthContext = createContext<AuthContextType | null>(null);
//
// 2. useContext — reads from a context
//      Example: const ctx = useContext(AuthContext);
//
// 3. useReducer — manages complex state with actions
//                 you need to explicitly type two core things: the State structure and the allowed Actions
//                 1. Define what your state object looks like
//                     interface StateType { count: number }
//                 2. Define the exact action objects allowed
//                     type ActionType = { type: 'increment' } | { type: 'decrement' };
//                 3. const [state, dispatch] = useReducer(
//                         (state: StateType, action: ActionType): StateType => {
//                             switch (action.type) {
//                                 case 'increment': return { count: state.count + 1 };
//                                 case 'decrement': return { count: state.count - 1 };
//                                 default: return state;
//                             }
//                       },
//                      { count: 0 }
//
//      Example: const [state, dispatch] = useReducer(reducer, initialState);
//               const [state, dispatch] = useReducer(fnReducer, initialCombinedState);
//
// 4. useEffect — runs side effects (fetching, subscriptions, timers)
//                Use useEffect whenever your React component needs to synchronise with systems
//                outside of React, such as
//                1. Fetching Data from an API:
//                 useEffect(() => {
//                     fetch('https://example.com')
//                         .then(res => res.json())
//                         .then(data => dispatch({ type: 'FETCH_SUCCESS', payload: data }));
//                 }, []); // Empty array means this runs exactly ONCE on initial launch
//                 2. Subscribing to External Events
//                     useEffect(() => {
//                              function handleResize() { console.log(window.innerWidth); }
//                 3. Managing Non-React Browser APIs
//                    useEffect(() => {
//                        const timer = setInterval(() => {
//                            console.log('Tick');
//                        }, 1000);
//                 Example: useEffect(() => { fetchData(); }, []);
// -------------------------------------------------------------
import React, {createContext, useContext, useReducer, useEffect, type ReactNode } from "react";


// -------------------------------------------------------------
// 2. DTO Imports
// -------------------------------------------------------------
// import { ORDER_BASE } from "../api/apiClient";
import type { dtoInventory, dtoOrder, dtoPayment } from "../models/dtoModels";

// Exported functions as properties on that object
// Benefits:
// •	Makes the origin of the function explicit.
// •	Avoids name collisions with local variables.
// •	Easier to see related functions grouped together.
import * as inventoryService from "../httpServices/inventoryService";
import * as orderService from "../httpServices/orderService";
import * as paymentService from "../httpServices/paymentService";
// or
// import { getInventorys as apiGetInventory } from "../httpServices/inventoryService";
// import { getOrders, createOrder as apiCreateOrder, getOrderById as apiGetOrderById } from "../httpServices/orderService";
// import { getPayments, payOrder as apiPayOrder } from "../httpServices/paymentService";


// -------------------------------------------------------------
// 3. ApiState — the global state shape
// -------------------------------------------------------------
// ApiState is the shape of your entire React global data store.  
//            stores in memory inside the React Context.
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
// 4. ApiMetaState is the small “status block” that tracks the loading/error state of your API calls.
//    These states are NOT part of ApiState above
//
// .NET equivalent: a singleton service that stores the same data in memory for all pages to read from.
// -------------------------------------------------------------
interface ApiMetaState {
    isLoading: boolean;      // true while loadData() is running
    error?: string;          // set if any API call fails
}


// -------------------------------------------------------------
// 5. Action is the union type that defines every possible message/action your reducer can receive. 
//    
//      This defines every possible state change your app can perform.
//      These are instructions telling the reducer how to update the global state.
//
// .NET equivalent: a set of methods on a singleton service that update the in-memory state.
//                  This is like commands in CQRS (Command Query Responsibility Segregation) pattern:
// public record LoadData(GlobalState State);
// public record OrderCreated(OrderDto Order);
// public record OrderPaid(PaymentDto Payment);
type Action =
    | { type: "LOAD_DATA"; payload: ApiState }
    | { type: "ORDER_CREATED"; payload: dtoOrder }
    | { type: "ORDER_PAID"; payload: dtoPayment }
    | { type: "SET_LOADING"; payload: boolean }             // NEW  
    | { type: "SET_ERROR"; payload: string | undefined };   // NEW;

// -------------------------------------------------------------
// 6. ApiContextValue is the public API your entire React app can access through your Context.  
//    It exposes all global data + all service functions + meta state in one typed interface.
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


// -------------------------------------------------------------
// 7. const ApiContext = … is the actual React Context object
//          that holds your entire global API state and functions.
//          Creates the DI container typed with ApiContextValue.
// -------------------------------------------------------------
const ApiContext = createContext<ApiContextValue | undefined>(undefined);


// -------------------------------------------------------------
// 8. initialState — Starting values for ApiState + ApiMetaState (optional).
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
// 9. Reducer - Pure function handling all Action transitions.
//              Every API action updates state through here
//              fnReducer — centralized state transitions
//
// signature and behavior of reducer:
// function reducer(state: AppState, action: Action): AppState {
//     switch (action.type) {
//         case "LOAD": 
//              return { ...state, items: action.payload };
//         case "ERROR": 
//              return { ...state, error: action.payload };
//         default: 
//              return state;
//     }
// }
// -------------------------------------------------------------
function fnReducer(state: CombinedState, action: Action): CombinedState {   //NEW — combined state type
    console.log("REDUCER ACTION:", action.type);

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
                // append the new order
                orders: [...state.orders, action.payload],
                // decrement stock for the item in the order (immutable update)
                inventorys: state.inventorys.map(i =>
                    i.id === action.payload.itemId
                        ? { ...i, stock: Math.max(0, i.stock - action.payload.quantity) }
                        : i
                )
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
// Hi reducer,
// I’m sending you a LOAD_DATA action.
// Here is the full ApiState (inventorys, orders, payments).Please update the global state with this data.”
//
// Define a TYPE called Action, and this type can be one of several shapes.
// Each shape is an object with a "type" property and a "payload" property.
// 3 shapes for now, but we can add more later.
// Why just 3 shapes? Because we only have 3 actions right now: LOAD_DATA, ORDER_CREATED, ORDER_PAID.


// -------------------------------------------------------------
// fnloadData() — fnloadData — Internal helper(startup loader; performs async fetches and dispatches actions)
//                fetches all Microservices data on startup
//                Called once inside useEffect()
//                it performs fetches and dispatches actions (SET_LOADING, LOAD_DATA, SET_ERROR) to the reducer.
// -------------------------------------------------------------
async function fnloadData(dispatch: React.Dispatch<Action>) {

    try {
        // debugger; // <— THIRD BREAKPOINT

        dispatch({ type: "SET_LOADING", payload: true });

        console.log("🔥 loadData() fired");
        //const inventorys = await apiGetInventory();
        const inventorys = await inventoryService.getInventorys();
        console.log("🔥 inventory fetched:", inventorys);

        //const orders = await getOrders();
        const orders = await orderService.getOrders();
        console.log("🔥 order fetched:", orders);

        //const payments = await getPayments();
        const payments = await paymentService.getPayments();
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
// 7. fnRefreshAll() — enterprise-grade manual reload
//                     Internal helper(thin wrapper that calls fnloadData)
// -------------------------------------------------------------
async function fnRefreshAll(dispatch: React.Dispatch<Action>) {
    console.log("🔄 Manual fnRefreshAll() triggered");

    await fnloadData(dispatch);
}


// -------------------------------------------------------------
// 10. Selectors (optional)
// -------------------------------------------------------------
// Selector examples (pure, no dispatch / side effects)
export function selectInventoryById(state: CombinedState, id: number) {
    return state.inventorys.find(i => i.id === id);
}

export function selectOrdersByStatus(state: CombinedState, status: string) {
    return state.orders.filter(o => o.status === status);
}

export function calculateInventoryValue(state: CombinedState) {
    return state.inventorys.reduce((sum, it) => sum + it.price * it.stock, 0);
}


// -------------------------------------------------------------
// 11. Internal helper functions
// -------------------------------------------------------------


// -------------------------------------------------------------
// 12.ApiProvider — wraps the entire React app
//                  Runs useReducer, useEffect, loads data, exposes context.
// -------------------------------------------------------------
// Provides global state + service functions to all pages
// It’s a custom React component that wraps your app and provides context.
//
// ApiProvider(component)
// │
// ├── inside functions(have state + dispatch)
// │     ├── createOrder()
// │     ├── payOrder()
// │     └── loadData()
// │
// └── outside functions(no state, no dispatch)
//       ├── mapOrder()
//       ├── mapInventory()
//       └── calculateTotal()
// -------------------------------------------------------------
export function ApiProvider({ children }: { children: ReactNode }) {
    // debugger; // <— FIRST BREAKPOINT

    //const [state, dispatch] = useReducer(reducer, initialState);
    const [state, dispatch] = useReducer(fnReducer, initialCombinedState);  //NEW — combined state

    // debugger; // <— SECOND BREAKPOINT
    console.log("STATE:", state);
    console.table(state.inventorys);
    console.table(state.orders);
    console.table(state.payments);

    state.inventorys.forEach((item, index) => {
        console.log(`Inventory[${index}]`, item);
    });

    state.orders.forEach((order, index) => {
        console.log(`Order[${index}]`, order);
    });

    state.payments.forEach((payment, index) => {
        console.log(`Payment[${index}]`, payment);
    });

    useEffect( () => { fnloadData(dispatch); }, []);

    async function createOrder(itemId: number, quantity: number) {

        console.log("🔥 createOrder() called:", itemId, quantity);
        //const order = await apiCreateOrder(itemId, quantity);
        const order = await orderService.createOrder(itemId, quantity);
        console.log("🔥 Backend returned:", order);

        dispatch({
            type: "ORDER_CREATED",
            payload: order
        });
    }

    async function payOrder(orderId: number, amount: number) {
        console.log("🔥 apiPayOrder() called:", orderId, amount);
        //const payment = await apiPayOrder(orderId, amount);
        const payment = await paymentService.payOrder(orderId, amount);

        dispatch({
            type: "ORDER_PAID",
            payload: payment
        });
    }

    // use Local wrapper that delegates to the http service 
    async function getOrderById(orderId: number): Promise<dtoOrder> {
        console.log("🔥 getOrderById() called (delegating to service):", orderId);

        //return await apiGetOrderById(orderId);
        return await orderService.getOrderById(orderId);
    }
    // or directly call the service function (no wrapper)
    // async function getOrderById(orderId: number): Promise<dtoOrder> {
    //     console.log("🔥 fetch() called:", orderId);
    //     const res = await fetch(`${ORDER_BASE}/orders/${orderId}`);
    //     return res.json();
    // }

    const value: ApiContextValue = {
        inventorys: state.inventorys,
        orders: state.orders,
        payments: state.payments,

        // NEW meta state
        isLoading: state.isLoading,
        error: state.error,

        createOrder,
        payOrder,

        getOrderById, // uses local wrapper

        // use the service function instead of direct fetch
        // getOrderById: apiGetOrderById,

        // NEW refresh-all
        refreshAll: () => fnRefreshAll(dispatch)
    };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}


// -------------------------------------------------------------
// 13. useApi() — custom hook for consuming ApiContext
//               Lets pages call createOrder(), payOrder(), etc.
// -------------------------------------------------------------
export function useApi(): ApiContextValue {
    const ctx = useContext(ApiContext);

    if (!ctx) throw new Error("useApi must be used inside ApiProvider");
    return ctx;
}












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
