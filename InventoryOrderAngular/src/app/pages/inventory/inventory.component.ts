import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { OrdersService } from '../../services/orders.service';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './inventory.component.html',
    styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

    inventory: InventoryItem[] = [];
    selectedId: number | null = null;
    quantity: number = 1;

    // ** Zone.js / Asynchronous Timing Issues **
    // If your API call is triggered from outside Angular's Zone
    // (such as a third - party JavaScript library, a web socket event, or certain setTimeout blocks),
    // the UI may not refresh automatically.
    constructor(
        private inventoryService: InventoryService,
        private ordersService: OrdersService,
        private cdr: ChangeDetectorRef,
        //private ngZone: NgZone,
    )
    {
        console.log("InventoryComponent constructor fired");   // ← breakpoint #1
    }

    // or
    ngOnInit(): void {
        console.log("InventoryComponent ngOnInit fired");
        this.loadInventory();
    }

    loadInventory(): void {
        this.inventoryService.getItems().subscribe({
            next: items => {
                console.log("InventoryService returned items:", items);
                this.inventory = items;
                this.cdr.detectChanges(); //Force UI refresh
            },
            error: err => {console.error("Error loading inventory:", err);
            }
        });

        // this.ngZone.run(() => {
        //     setTimeout(() => {
        //         this.inventoryService.getItems().subscribe(items => {
        //             this.inventory = items;
        //         });
        //     }, 2000);
        // });

        // setTimeout(() => {
        //     this.inventoryService.getItems().subscribe({
        //         next: items => {
        //             console.log("InventoryService returned items:", items);
        //             this.inventory = items;
        //             this.cdr.detectChanges(); // Force UI refresh
        //         },
        //         error: err => {
        //             console.error("Error loading inventory:", err);
        //         }
        //     });
        // }, 2000);   // 2‑second delay

        
    }

    createOrder(): void {
        if (!this.selectedId) return;

        this.ordersService.createOrder(this.selectedId, this.quantity)
            .subscribe({
                next: () => {
                    this.quantity = 1;
                    this.loadInventory();   // refresh inventory after order
                },
                error: err => {
                    console.error("Error creating order:", err);
                }
            });
    }
}
