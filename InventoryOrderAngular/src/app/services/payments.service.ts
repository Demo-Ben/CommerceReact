// import { Service } from '@angular/core';

// @Service()
// export class PaymentsService {}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  //private baseUrl = '/api/payments';
  //private baseUrl = 'https://localhost:5004/payments';
  private baseUrl = environment.paymentsApi;

  constructor(private http: HttpClient) { }

  getPayments(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
