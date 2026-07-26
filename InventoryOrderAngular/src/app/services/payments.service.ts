import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentItem {
    id: number;
    orderId: number;
    total: number;
    status: string;
    paidOn: string;
}

@Injectable({
    providedIn: 'root'
})
export class PaymentsService {

    private baseUrl = 'https://localhost:5004/payments';

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
