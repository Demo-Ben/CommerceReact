import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { remoteUrl } from '../../environments/environment';

export interface OrderItem {
    id: number;
    productId: number;  //itemId: number;
    quantity: number;
    amount: number; // total: number;
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    //private baseUrl = 'https://localhost:5002/orders';
    private baseUrl = remoteUrl.ordersApi;

    constructor(private http: HttpClient) { }

    getOrders(): Observable<OrderItem[]> {
        console.log("OrdersService.getOrders() called");
        return this.http.get<OrderItem[]>(this.baseUrl);
    }

    createOrder(itemId: number, quantity: number): Observable<void> {
        console.log("OrdersService.createOrder() called:", itemId, quantity);
        return this.http.post<void>(`${this.baseUrl}`, { itemId, quantity });
    }

    payOrder(id: number, total: number): Observable<void> {
        console.log("OrdersService.payOrder() called:", id, total);

        // return this.http.post<void>(`${this.baseUrl}/${id}/payments`, { total }); // Original line
        // Use the payments API endpoint (matches backend: POST https://localhost:5004/payments)
        return this.http.post<void>(`${remoteUrl.paymentsApi}`, { orderId: id, amount: total });
    }

    deleteOrder(id: number): Observable<void> {
        console.log("OrdersService.deleteOrder() called:", id);
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
