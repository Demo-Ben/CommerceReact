// import { Service } from '@angular/core';

// @Service()
// export class OrdersService {}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl = '/api/orders';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getOrder(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
