import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersService, OrderItem } from '../../services/orders.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

    orders: OrderItem[] = [];

    constructor(private ordersService: OrdersService,
                private cdr: ChangeDetectorRef)
    {
        console.log("OrdersComponent constructor fired");
    }

    ngOnInit(): void {
        console.log("OrdersComponent ngOnInit fired");
        this.loadOrders();
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
                this.loadOrders();   // refresh after delete
            },
            error: err => {
                console.error("Error deleting order:", err);
            }
        });
    }
}
