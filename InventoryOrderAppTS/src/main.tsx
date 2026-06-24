// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//     <StrictMode>
//         <App />
//     </StrictMode>,
// )



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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
