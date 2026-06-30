
// inventory - orders - ts /
// │
// ├── index.html
// ├── package.json
// ├── tsconfig.json
// ├── vite.config.ts
// │
// └── src /
//     │
//     ├── main.tsx
//     ├── App.tsx
//     ├── index.css
//     │
//     ├── api /
//     │   └── apiClient.ts
//     │
//     ├── context /
//     │   └── ApiContext.tsx
//     │
//     ├── features /
//     │   │
//     │   ├── inventory /
//     │   │   └── InventoryPage.tsx
//     │   │
//     │   ├── orders /
//     │   │   └── OrderPage.tsx
//     │   │
//     │   └── payments /
//     │       └── PaymentPage.tsx
//     │
//     └── types /
//         └── models.ts

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
