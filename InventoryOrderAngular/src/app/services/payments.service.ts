import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { remoteUrl } from '../../environments/environment';

// export interface PaymentItem {
//     id: number;
//     orderId: number;
//     total: number;
//     status: string;
//     paidOn: string;
// }
export interface PaymentItem {
    id: number;
    orderId: number;
    amount: number;    // maps to API's Amount (decimal)
    status: string;
    paidAt: string;    // ISO date string from API's PaidAt
}

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    //private baseUrl = 'https://localhost:5004/payments';
    private baseUrl = remoteUrl.paymentsApi;

    constructor(private http: HttpClient) { }

    getPayments(): Observable<PaymentItem[]> {
        console.log("PaymentsService.getPayments() called");
        return this.http.get<PaymentItem[]>(this.baseUrl);
    }

    payAgain(id: number, total: number): Observable<void> {
        console.log("PaymentsService.payAgain() called:", id, total);
        return this.http.post<void>(`${this.baseUrl}/${id}/payagain`, { total });
    }
}
