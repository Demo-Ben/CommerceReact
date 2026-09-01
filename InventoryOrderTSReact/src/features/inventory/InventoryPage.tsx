//Terms you are using in this file
// 1. Client Component
// 2. Custom Hook (useApi) - const { inventorys, createOrder } = useApi();
// 3. useState — Local UI State - const [selectedId, setSelectedId] = useState<string>("");
//                                const [quantity, setQuantity] = useState<number>(1);
// 4. Controlled Components - <select value={selectedId} onChange={e => setSelectedId(e.target.value)} />
//                            <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
// 5. Derived State / Computation - const item = inventorys.find(i => String(i.id) === selectedId);
// 6. Event Handlers - onClick, onChange, onMouseEnter, onMouseLeave
// 7. Conditional Rendering - {inventorys.map(item => (  <tr key={item.id}>...</tr> ))}
// 8. List Rendering with Keys - <tr key={item.id}>
// 9. Input Validation Logic
// 10. Calling Global Actions (Context + Reducer) - createOrder(Number(selectedId), qty);
// 11. JSX Rendering
// 12. Inline Styles
// 13. SPA Navigation Pattern (Manual Routing) - {page === "inventory" && <InventoryPage />}


// 1. Imports
// useState gives React component state.
import React, { useState } from "react";
// useApi() is your custom hook that exposes: inventorys (your inventory list),createOrder() (API call)
import { useApi } from "../../context/ApiContext";


// 2.Component definition
// Render #1 → React calls InventoryPage() → useApi() → UI shows inventory list
// Render #2 → selectedId changed → React calls InventoryPage() → useApi() → UI updates
//             Triggered by user clicking on an inventory item
// Render #3 → quantity changed → React calls InventoryPage() → useApi() → UI updates
//             Triggered by user changing quantity input
// Render #4 → createOrder() updated context → React calls InventoryPage() → useApi() → UI updates
//             Triggered by user clicking "Create Order" button
// Render #5 → navigation → React calls InventoryPage() → useApi() → UI shows again
export default function InventoryPage() {

    // 3. Extract API values: This pulls values from your API context provider
    //                        ,not fetch data rather simply reads values from your context provider.
    //    This line runs every time your component renders.
    //    “render” means in React:
    //        1. The first time the component is displayed on the screen.
    //        2. Any state changes (useState)
    //        3. Any context values change (useApi)
    //        4. Any parent component re-renders
    //    In this case, we are extracting the inventory list and the createOrder() function from the API context.
    const { inventorys, createOrder } = useApi();               

    // 4. Local component state.
    //    React state: selectedId → which item the user selected. quantity → how many units to order
    const [selectedId, setSelectedId] = useState<string>("");

    // useState<number>(1) means React will track this value and re-render when it changes.
    const [quantity, setQuantity] = useState<number>(1);


    // 5. Order creation handler
    const handleCreateOrder = () => {
        console.log("handleCreateOrder fired:", selectedId, quantity);


        //Step A — Validate selected item
        if (!selectedId) {
            console.log("No item selected");
            return;
        }

        //Step B — Validate quantity
        const qty = Number(quantity);
        if (isNaN(qty) || qty < 1) {
            console.log("Invalid quantity");
            return;
        }

        // Step C — Find item name for confirmation
        const item = inventorys.find(i => String(i.id) === selectedId);
        const itemName = item ? item.name : `#${selectedId}`;

        // Step D — Ask user to confirm
        const confirmed = window.confirm(`Create order for "${itemName}" (quantity: ${quantity})?`);
        if (!confirmed) {
            console.log("Order creation cancelled by user");
            return;
        }

        // Step E — Call API
        createOrder(Number(selectedId), qty);

        // Step F — Reset quantity.
        setQuantity(1);
    };

    return (
        <div>
            {/* React components return JSX.
                JSX is NOT HTML — it's JavaScript that looks like HTML.
                Every time state changes, React re-renders this return block.
            */}
            <h2>Available Inventory List</h2>

            {/* Tables in React work exactly like HTML tables.
                The difference is: dynamic rows must be generated using .map().
            */}
            <div
                style={{
                    display: "flex",              // enable flexbox
                    justifyContent: "center",     // center horizontally
                    marginTop: "20px"             // optional spacing
                }}
            >
                <table border={1} cellPadding={4}>
                    <thead>
                        <tr>
                            <th>Stock ID</th>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* inventoryItems.map(...) loops through your inventory array.
                        React requires a "key" for each row to track updates efficiently. */}
                        {inventorys.map(item => (   
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.stock}</td>
                                <td>${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3>Create Order</h3>

            <div>
                <label>
                    Item:
                    {/*  <select> always returns a string.
                        That's why selectedId is stored as a string.
                        React's onChange gives you the event, and you read e.target.value.
                    */}
                    <select value={selectedId} onChange={e => setSelectedId(e.target.value)} >

                        <option value="">-- select --</option>

                        {/* Same pattern: map inventory into <option> elements.
                            The "value" is the item.id, which is a number,
                            but HTML always returns it as a string.
                        */}
                        {inventorys.map(item => (               
                            <option key={item.id} value={item.id}>
                                {item.name} (stock: {item.stock})
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Quantity:
                    {/* <input type="number"> returns a string too.
                        So we convert it using Number(...).
                        React re-renders when quantity changes.
                    */}
                    <input type="number" min={1} value={quantity}
                        onChange={e => setQuantity(Number(e.target.value))}
                    />
                </label>
            </div>

            {/* Clicking this button calls handleCreateOrder().
                React does NOT refresh the page — it updates state and re-renders.
            */}
            <button onClick={handleCreateOrder}>Create Order</button>
        </div>
    );
}


