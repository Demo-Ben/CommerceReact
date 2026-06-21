// function InventoryPage() {
//   return (
//     <p>Hello world!</p>
//   );
// }

// export default InventoryPage;

import React, { useState } from "react";
import { useApi } from "../../context/ApiContext";

export default function InventoryPage() {
    const { inventory, createOrder } = useApi();
    const [selectedId, setSelectedId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const handleCreateOrder = () => {
        console.log("handleCreateOrder fired:", selectedId, quantity);

        if (!selectedId) {
            console.log("No item selected");
            return;
        }

        createOrder(Number(selectedId), Number(quantity));

        setQuantity(1);
    };


    return (
        <div>
            <h2>Inventory</h2>
            <table border="1" cellPadding="4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Stock</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.stock}</td>
                            <td>${item.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Create Order</h3>
            <div>
                <label>
                    Item:
                    <select
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                    >
                        <option value="">-- select --</option>
                        {inventory.map(item => (
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
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                    />
                </label>
            </div>

            <button onClick={handleCreateOrder}>Create Order</button>
        </div>
    );
}
