//InventoryOrderTS 
//│
//├── index.html			← The single HTML file React mounts into.
//│
//├── package.json			← Defines dependencies, scripts, TypeScript version, React version.
//├── package - lock.json
//│
//├── tsconfig.json			← Main TypeScript configuration
//├── tsconfig.node.json
//│
//├── vite.config.ts		← Vite dev server configuration (port, plugins, aliases).
//│
//├── node_modules /        ← auto - generated
//│
//└── src /
//    ├── main.tsx			← Entry point. Renders <App /> into the DOM
//    ├── App.tsx			← Root component.
//    │
//    ├── assets /			← Static images, logos, icons.
//    │     └── react.svg
//    │
//    ├── components /		← Reusable UI components.
//    │     └── (your.tsx components)
//    │
//    ├── pages /			← Full pages / screens. here is "features"
//    │     └── (your page components)
//    ├── features /        or call pages /
//    │   │
//    │   ├── inventory /
//    │   │   └── InventoryPage.tsx
//    │   │
//    │   ├── orders /
//    │   │   └── OrderPage.tsx
//    │   │
//    │   └── payments /
//    │       └── PaymentPage.tsx
//    │
//    ├── context /			← React Context provider.
//    │     └── ApiContext.tsx
//    │
//    ├── hooks /			← Custom React hooks.
//    │     └── useInventory.ts
//    │
//    ├── types /			← TypeScript models and interfaces.
//    │     └── models.ts
//    │
//    └── services /		← API clients, fetch wrappers.
//          └── apiClient.ts


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx loaded"); // breakpoint here
const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// break down of the above code:
// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// )
