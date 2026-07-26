import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsService, PaymentItem } from '../../services/payments.service';

@Component({
    selector: 'app-payments',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentComponent implements OnInit {

    payments: PaymentItem[] = [];

    constructor(private paymentsService: PaymentsService) {
        console.log("PaymentComponent constructor fired");
    }

    ngOnInit(): void {
        console.log("PaymentComponent ngOnInit fired");
        this.loadPayments();
    }

    loadPayments(): void {
        this.paymentsService.getPayments().subscribe({
            next: items => {
                console.log("PaymentsService returned payments:", items);
                this.payments = items;
            },
            error: err => {
                console.error("Error loading payments:", err);
            }
        });
    }

    payAgain(id: number, total: number): void {
        console.log("PayAgain clicked:", id, total);

        this.paymentsService.payAgain(id, total).subscribe({
            next: () => {
                console.log("Payment reprocessed:", id);
                this.loadPayments();   // refresh after pay again
            },
            error: err => {
                console.error("Error reprocessing payment:", err);
            }
        });
    }
}
