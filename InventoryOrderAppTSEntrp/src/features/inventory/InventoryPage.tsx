import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function InventoryPage() {

    // When You are calling your custom hook useApi()
    // That hook returns an "object""
    // You extract two properties from that "object":
    //     inventory
    //     createOrder
    // that's why you need "import { useApi } from "../../context/ApiContext""
    const { inventorys, createOrder } = useApi();               // renamed from "inventory"

    // React state: when selectedId changes, React re-renders this component.
    const [selectedId, setSelectedId] = useState<string>("");

    // useState<number>(1) means React will track this value and re-render when it changes.
    const [quantity, setQuantity] = useState<number>(1);

    const handleCreateOrder = () => {
        console.log("handleCreateOrder fired:", selectedId, quantity);

        if (!selectedId) {
            console.log("No item selected");
            return;
        }

        // React event handlers are just functions.
        // Calling createOrder triggers your API context logic.
        createOrder(Number(selectedId), Number(quantity));

        // Reset quantity after creating an order.
        // This triggers a re-render because state changed.
        setQuantity(1);
    };

    return (
        <div>
            {/* React components return JSX.
                JSX is NOT HTML — it's JavaScript that looks like HTML.
                Every time state changes, React re-renders this return block.
            */}
            <h2>Inventory</h2>

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
                            <th>Id</th>
                            <th>Name</th>
                            <th>Stock</th>
                            <th>Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* inventoryItems.map(...) loops through your inventory array.
                        React requires a "key" for each row to track updates efficiently. */}
                        {inventorys.map(item => (   // renamed from "inventory"
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
                    <select
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                    >
                        <option value="">-- select --</option>

                        {/* Same pattern: map inventory into <option> elements.
                            The "value" is the item.id, which is a number,
                            but HTML always returns it as a string.
                        */}
                        {inventorys.map(item => (               // renamed from "inventory"
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
                    <input
                        type="number"
                        min={1}
                        value={quantity}
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



// import React, { useState } from "react";
// import { useApi } from "../../context/ApiContext";

// export default function InventoryPage() {
//     const { inventory, createOrder } = useApi();

//     // selectedId is a string because <select> returns string values
//     const [selectedId, setSelectedId] = useState<string>("");

//     // quantity is a number
//     const [quantity, setQuantity] = useState<number>(1);

//     const handleCreateOrder = () => {
//         console.log("handleCreateOrder fired:", selectedId, quantity);

//         if (!selectedId) {
//             console.log("No item selected");
//             return;
//         }

//         // TypeScript ensures these are numbers
//         createOrder(Number(selectedId), Number(quantity));

//         setQuantity(1);
//     };

//     return (
//         <div>
//             <h2>Inventory</h2>
//             <table border={1} cellPadding={4}>
//                 <thead>
//                     <tr>
//                         <th>Id</th>
//                         <th>Name</th>
//                         <th>Stock</th>
//                         <th>Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {inventory.map(item => (
//                         <tr key={item.id}>
//                             <td>{item.id}</td>
//                             <td>{item.name}</td>
//                             <td>{item.stock}</td>
//                             <td>${item.price}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <h3>Create Order</h3>
//             <div>
//                 <label>
//                     Item:
//                     <select
//                         value={selectedId}
//                         onChange={e => setSelectedId(e.target.value)}
//                     >
//                         <option value="">-- select --</option>
//                         {inventory.map(item => (
//                             <option key={item.id} value={item.id}>
//                                 {item.name} (stock: {item.stock})
//                             </option>
//                         ))}
//                     </select>
//                 </label>
//             </div>

//             <div>
//                 <label>
//                     Quantity:
//                     <input
//                         type="number"
//                         min={1}
//                         value={quantity}
//                         onChange={e => setQuantity(Number(e.target.value))}
//                     />
//                 </label>
//             </div>

//             <button onClick={handleCreateOrder}>Create Order</button>
//         </div>
//     );
// }
