import React, { useState } from "react";

import { ApiProvider } from "./context/ApiContext";

import InventoryPage from "./features/inventory/InventoryPage";
import OrderPage from "./features/orders/OrderPage";
import PaymentPage from "./features/payments/PaymentPage";

// Define allowed page names
// Define allowed page names as a TypeScript union type.
// This prevents invalid values like "inventroy" or "home".
// Equivalent to an enum with strict string values.
type Page = "inventory" | "orders" | "payments";

function App() {
    // React state hook.
    //  page = current page name
    //  setPage = function to update the page
    //  useState<Page>("inventory") means:
    //   - initial value is "inventory"
    //   - TypeScript enforces Page type
    const [page, setPage] = useState<Page>("inventory");

    // JSX returned by the component.
    // React will re-render this UI whenever state changes (setPage).
    return (
        <ApiProvider>
            {/* Inline styling for layout */}
            <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>

                <h1>Mini Commerce (React + TypeScript)</h1>

                {/* Navigation bar */}
                <nav style={{ marginBottom: "1rem" }}>
                    <button onClick={() => setPage("inventory")}>Inventory</button>
                    <button onClick={() => setPage("orders")}>Orders</button>
                    <button onClick={() => setPage("payments")}>Payments</button>
                </nav>

                {/* Conditional rendering */}
                {/* If page === "inventory", show InventoryPage component */}
                {page === "inventory" && <InventoryPage />}

                {/* If page === "orders", show OrderPage component */}
                {page === "orders" && <OrderPage />}

                {/* If page === "payments", show PaymentPage component */}
                {page === "payments" && <PaymentPage />}
            </div>
        </ApiProvider>
    );
}

// Export App as the default export of this module.
// This allows other files to import it using: import App from "./App";
export default App;



// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <section id="center">
//         <div className="hero">
//           <img src={heroImg} className="base" width="170" height="179" alt="" />
//           <img src={reactLogo} className="framework" alt="React logo" />
//           <img src={viteLogo} className="vite" alt="Vite logo" />
//         </div>
//         <div>
//           <h1>Get started</h1>
//           <p>
//             Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
//           </p>
//         </div>
//         <button
//           type="button"
//           className="counter"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           Count is {count}
//         </button>
//       </section>

//       <div className="ticks"></div>

//       <section id="next-steps">
//         <div id="docs">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#documentation-icon"></use>
//           </svg>
//           <h2>Documentation</h2>
//           <p>Your questions, answered</p>
//           <ul>
//             <li>
//               <a href="https://vite.dev/" target="_blank">
//                 <img className="logo" src={viteLogo} alt="" />
//                 Explore Vite
//               </a>
//             </li>
//             <li>
//               <a href="https://react.dev/" target="_blank">
//                 <img className="button-icon" src={reactLogo} alt="" />
//                 Learn more
//               </a>
//             </li>
//           </ul>
//         </div>
//         <div id="social">
//           <svg className="icon" role="presentation" aria-hidden="true">
//             <use href="/icons.svg#social-icon"></use>
//           </svg>
//           <h2>Connect with us</h2>
//           <p>Join the Vite community</p>
//           <ul>
//             <li>
//               <a href="https://github.com/vitejs/vite" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#github-icon"></use>
//                 </svg>
//                 GitHub
//               </a>
//             </li>
//             <li>
//               <a href="https://chat.vite.dev/" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#discord-icon"></use>
//                 </svg>
//                 Discord
//               </a>
//             </li>
//             <li>
//               <a href="https://x.com/vite_js" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#x-icon"></use>
//                 </svg>
//                 X.com
//               </a>
//             </li>
//             <li>
//               <a href="https://bsky.app/profile/vite.dev" target="_blank">
//                 <svg
//                   className="button-icon"
//                   role="presentation"
//                   aria-hidden="true"
//                 >
//                   <use href="/icons.svg#bluesky-icon"></use>
//                 </svg>
//                 Bluesky
//               </a>
//             </li>
//           </ul>
//         </div>
//       </section>

//       <div className="ticks"></div>
//       <section id="spacer"></section>
//     </>
//   )
// }

// export default App
