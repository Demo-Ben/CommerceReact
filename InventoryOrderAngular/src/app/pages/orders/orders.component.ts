import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersService, OrderItem } from '../../services/orders.service';
import { InventoryService, InventoryItem } from '../../services/inventory.service';  //add


@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

    orders: OrderItem[] = [];
    inventory: InventoryItem[] = [];  //add

    constructor(private ordersService: OrdersService,
                private inventoryService: InventoryService,   //add
                private cdr: ChangeDetectorRef)
    {
        console.log("OrdersComponent constructor fired");
    }

    ngOnInit(): void {
        console.log("OrdersComponent ngOnInit fired");
        this.loadOrders();
        this.loadInventory();  //add
    }

    loadOrders(): void {
        this.ordersService.getOrders().subscribe({
            next: items => {
                console.log("OrdersService returned orders:", items);
                this.orders = items;
                this.cdr.detectChanges(); // Force UI refresh
            },
            error: err => {
                console.error("Error loading orders:", err);
            }
        });
    }


    //add
    loadInventory(): void {
        this.inventoryService.getItems().subscribe({
            next: items => {
                console.log("InventoryService returned items:", items);
                this.inventory = items;
                this.cdr.detectChanges();
            },
            error: err => {
                console.error("Error loading inventory:", err);
            }
        });
    }


    //add
    createOrder(itemId: number, quantity: number): void {
        console.log("CreateOrder clicked:", itemId, quantity);

        const item = this.inventory.find(i => i.id === itemId);
        if (!item) {
            console.warn("Item not found in local inventory:", itemId);
            return;
        }

        if (quantity < 1) return;

        if (item.stock < quantity) {
            console.warn("Not enough stock to create order");
            return;
        }

        const confirmed = confirm(`Create order for "${item.name}" (Qty: ${quantity})?`);
        if (!confirmed) {
            console.log("Create order canceled by user");
            return;
        }

        // Commented out to avoid double-reduction if API call fails
        //item.stock -= quantity;

        // Optimistic UI update: reduce local stock immediately
        this.cdr.detectChanges();

        this.ordersService.createOrder(itemId, quantity).subscribe({
            next: () => {
                console.log("Order created for item:", itemId);
                this.loadOrders();    // refresh orders list
                this.loadInventory(); // refresh inventory (stock may have changed)
            },
            error: err => {
                console.error("Error creating order:", err);
                // Restore stock on error
                item.stock += quantity;
                this.cdr.detectChanges();
            }
        });
    }

    payOrder(id: number, total: number): void {
        console.log("PayOrder clicked:", id, total);

        this.ordersService.payOrder(id, total).subscribe({
            next: () => {
                console.log("Order paid:", id);
                this.loadOrders();   // refresh after payment
            },
            error: err => {
                console.error("Error paying order:", err);
            }
        });
    }

    deleteOrder(id: number): void {
        console.log("DeleteOrder clicked:", id);

        this.ordersService.deleteOrder(id).subscribe({
            next: () => {
                console.log("Order deleted:", id);
                this.loadOrders();    // refresh after delete
                this.loadInventory(); // refresh inventory (stock may have changed)
            },
            error: err => {
                console.error("Error deleting order:", err);
            }
        });
    }

    // Synchronous lookup to avoid per-cell HTTP calls in the template
    getProductName(productId: number): string {
        const item = this.inventory.find(i => i.id === productId);
        return item ? item.name : `Product ${productId}`;
    }

}
