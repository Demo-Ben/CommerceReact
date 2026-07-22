// import { Service } from '@angular/core';

// @Service()
// export class PaymentsService {}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  private baseUrl = '/api/payments';

  constructor(private http: HttpClient) { }

  getPayments(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
