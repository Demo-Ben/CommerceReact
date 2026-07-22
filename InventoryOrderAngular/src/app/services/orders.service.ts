import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  //private baseUrl = '/api/orders';
  //private baseUrl = 'https://localhost:5002/orders';
  private baseUrl = environment.ordersApi;

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createOrder(itemId: number, quantity: number): Observable<any> {
    return this.http.post(this.baseUrl, {
      itemId,
      quantity
    });
  }
}
