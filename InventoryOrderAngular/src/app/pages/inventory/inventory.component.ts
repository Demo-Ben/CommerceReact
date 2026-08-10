import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { OrdersService } from '../../services/orders.service';


// 1. Component Metadata (Decorator)
@Component({
    selector: 'app-inventory',   //the tag used in HTML.
    standalone: true,            //This component does not belong to an NgModule
                                 //Angular 15+ allows standalone components that import their own dependencies.

    imports: [CommonModule, FormsModule],       // CommonModule → enables *ngIf, *ngFor, etc.
                                                // FormsModule → enables [(ngModel)] two‑way binding.

    templateUrl: './inventory.component.html',  //templateUrl / styleUrls:  External HTML + CSS files.
    styleUrls: ['./inventory.component.css']
})


// 2. Component Class
export class InventoryComponent implements OnInit {

    // 2.1 Component State (Properties)
    // These properties are reactive: When they change, Angular re-renders the UI — but only if Angular knows they changed.
    inventory: InventoryItem[] = [];        //Holds the list of items returned from the API.
    selectedId: number | null = null;       //Bound to a dropdown or list selection.
    quantity: number = 1;                   //Bound to an input field for order creation.

    // ** Zone.js / Asynchronous Timing Issues **
    // If your API call is triggered from outside Angular's Zone
    // (such as a third - party JavaScript library, a web socket event, or certain setTimeout blocks),
    // the UI may not refresh automatically.

    // 2.2 Constructor + Dependency Injection
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
    // 2.3 Lifecycle Hook: ngOnInit - Angular calls ngOnInit() once, after the constructor.
    ngOnInit(): void {
        console.log("InventoryComponent ngOnInit fired");
        this.loadInventory();
    }


    // 2.4 loadInventory(): API Call + Change Detection
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

    // Helper to get stock of currently selected item
    get selectedStock(): number {
        if (!this.selectedId) return 0;
        const it = this.inventory.find(i => i.id === this.selectedId);
        return it ? it.stock : 0;
    }


    // createOrder(): API Call + Refresh
    createOrder(): void {
        if (!this.selectedId) return;
        if (this.quantity < 1) return;

        const item = this.inventory.find(i => i.id === this.selectedId);
        if (!item) return;

        if (item.stock < this.quantity) {
            console.warn("Not enough stock to create order");
            return;
        }

        const qty = this.quantity;

        // Confirmation dialog
        const confirmed = confirm(`Create order for "${item.name}" (Qty: ${qty})?`);
        if (!confirmed) {
            console.log("Create order canceled by user");
            return;
        }

        // Optimistic update: reduce local stock immediately
        item.stock -= qty;
        this.cdr.detectChanges();

        this.ordersService.createOrder(this.selectedId, qty)
            .subscribe({
                next: () => {
                    this.quantity = 1;
                    this.loadInventory();   // refresh inventory after order
                },
                error: err => {
                    console.error("Error creating order:", err);
                    // Restore stock on error
                    item.stock += qty;
                    this.cdr.detectChanges();
                }
            });
    }
}
