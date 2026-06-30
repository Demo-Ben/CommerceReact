//InventoryOrderJS
//│
//├── index.html			← The single HTML file React mounts into.
//│
//├── package.json			← Defines dependencies, scripts, TypeScript version, React version.
//├── package - lock.json
//│
//├── tsconfig.json			← Main TypeScript configuration
//├── tsconfig.node.json
//│
//├── vite.config.js		← Vite dev server configuration (port, plugins, aliases).
//│
//├── node_modules /        ← auto - generated
//│
//└── src /
//    ├── main.jsx			← Entry point. Renders <App /> into the DOM
//    ├── App.jsx			← Root component.
//    │
//    ├── assets /			← Static images, logos, icons.
//    │     └── react.svg
//    │
//    ├── components /		← Reusable UI components.
//    │     └── (your.jsx components)
//    │
//    ├── pages /			← Full pages / screens. here is "features"
//    │     └── (your page components)
//    ├── features /        or call pages /
//    │   │
//    │   ├── inventory /
//    │   │   └── InventoryPage.jsx
//    │   │
//    │   ├── orders /
//    │   │   └── OrderPage.jsx
//    │   │
//    │   └── payments /
//    │       └── PaymentPage.jsx
//    │
//    ├── context /			← React Context provider.
//    │     └── ApiContext.jsx
//    │
//    ├── hooks /			← Custom React hooks.
//    │     └── useInventory.js
//    │
//    ├── types /			← TypeScript models and interfaces.
//    │     └── models.js
//    │
//    └── services /		← API clients, fetch wrappers.
//          └── apiClient.js

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

// main.jsx -> return whatever function App() { ... } is returning, which is the main UI of your app.

