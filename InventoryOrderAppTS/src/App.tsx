import React, { useState } from "react";

// ApiProvider wraps the whole app and provides shared state + API calls
import { ApiProvider } from "./context/ApiContext";

// import pages from features folder
import InventoryPage from "./features/inventory/InventoryPage";
import OrderPage from "./features/orders/OrderPage";
import PaymentPage from "./features/payments/PaymentPage";

// Define allowed page names
// Define allowed page names as a TypeScript union type.
// This prevents invalid values like "inventroy" or "home".
// Equivalent to an enum with strict string values.
type Page = "inventory" | "orders" | "payments";

function App() {

    // *** your comment ***
    // When the button is clicked -> Call setPage("page name") -> React updates the page state -> React re-renders
    // *** my comment ***
    // page state controls which component is shown on the right side
    const [page, setPage] = useState<Page>("inventory");

    // *** my comment ***
    // map page string → readable banner title
    const pageTitleMap = {
        inventory: "Inventory",
        orders: "Orders",
        payments: "Payments"
    };

    return (
        <ApiProvider>

            {/* *** your comment ***
                main layout container
                flex layout: left sidebar + right content
            */}
            <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>

                {/* *** your comment ***
                    left side menu,  deep blue background, vertical menu
                */}
                <div
                    style={{
                        width: "200px",
                        backgroundColor: "#2B35AF", // deep blue
                        color: "white",
                        padding: "1rem"
                    }}>

                    <h2
                        style={{
                            backgroundColor: "transparent",    // *** my comment *** transparent background
                            color: "white",                    // *** my comment *** white font
                            textAlign: "center",               // *** my comment *** center the title
                            margin: 0,                         // *** my comment *** remove default margin
                            padding: "0.5rem"                  // *** my comment *** add slight spacing
                        }}>
                        Menu
                    </h2>

                    {/* *** your comment ***
                        menu buttons
                        *** my comment ***
                        clicking sets the page state
                    */}
                    <div style={{
                            marginTop: "1rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem"
                            }}
                    >

                        <button
                            onClick={() => setPage("inventory")}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#004080")} // hover deep blue
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                border: "none",
                                padding: "0.75rem",
                                fontSize: "1.1rem",        // *** my comment *** increase font size
                                textAlign: "center",       // *** my comment *** center text
                                cursor: "pointer",
                                width: "100%"              // *** my comment *** full width button
                            }}
                        >
                            Inventory
                        </button>

                        <button
                            onClick={() => setPage("orders")}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#004080")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                border: "none",
                                padding: "0.75rem",
                                fontSize: "1.1rem",
                                textAlign: "center",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        >
                            Orders
                        </button>

                        <button
                            onClick={() => setPage("payments")}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#004080")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                            style={{
                                backgroundColor: "transparent",
                                color: "white",
                                border: "none",
                                padding: "0.75rem",
                                fontSize: "1.1rem",
                                textAlign: "center",
                                cursor: "pointer",
                                width: "100%"
                            }}
                        >
                            Payments
                        </button>

                    </div>
                </div>

                {/* *** your comment ***
                    right side container,  contains top banner + page content
                */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>

                    {/* *** your comment ***
                        top banner
                        *** my comment ***
                        sky blue background showing current page title
                    */}
                    <div
                        style={{
                            backgroundColor: "#4361EE", // sky blue
                            padding: "1rem",
                            color: "darkred",
                            fontSize: "1.5rem",
                            fontWeight: "bold"
                        }}
                    >
                        {pageTitleMap[page]}
                    </div>

                    {/* *** your comment ***
                        page body,  conditional rendering based on page value
                    */}
                    <div style={{ padding: "1rem" }}>
                        {page === "inventory" && <InventoryPage />}
                        {page === "orders" && <OrderPage />}
                        {page === "payments" && <PaymentPage />}
                    </div>
                </div>
            </div>
        </ApiProvider>
    );
}

// Export App as the default export of this module.
// This allows other files to import it using: import App from "./App";
export default App;





// import React, { useState } from "react";

// import { ApiProvider } from "./context/ApiContext";

// import InventoryPage from "./features/inventory/InventoryPage";
// import OrderPage from "./features/orders/OrderPage";
// import PaymentPage from "./features/payments/PaymentPage";

// // Define allowed page names
// // Define allowed page names as a TypeScript union type.
// // This prevents invalid values like "inventroy" or "home".
// // Equivalent to an enum with strict string values.
// type Page = "inventory" | "orders" | "payments";

// function App() {
//     // React state hook.
//     //  page = current page name
//     //  setPage = function to update the page
//     //  useState<Page>("inventory") means:
//     //   - initial value is "inventory"
//     //   - TypeScript enforces Page type
//     const [page, setPage] = useState<Page>("inventory");

//     // JSX returned by the component.
//     // React will re-render this UI whenever state changes (setPage).
//     return (
//         <ApiProvider>
//             {/* Inline styling for layout */}
//             <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>

//                 <h1>Mini Commerce (React + TypeScript)</h1>

//                 {/* Navigation bar */}
//                 <nav style={{ marginBottom: "1rem" }}>
//                     <button onClick={() => setPage("inventory")}>Inventory</button>
//                     <button onClick={() => setPage("orders")}>Orders</button>
//                     <button onClick={() => setPage("payments")}>Payments</button>
//                 </nav>

//                 {/* Conditional rendering */}
//                 {/* If page === "inventory", show InventoryPage component */}
//                 {page === "inventory" && <InventoryPage />}

//                 {/* If page === "orders", show OrderPage component */}
//                 {page === "orders" && <OrderPage />}

//                 {/* If page === "payments", show PaymentPage component */}
//                 {page === "payments" && <PaymentPage />}
//             </div>
//         </ApiProvider>
//     );
// }

// // Export App as the default export of this module.
// // This allows other files to import it using: import App from "./App";
// export default App;


