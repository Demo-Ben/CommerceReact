// import { Service } from '@angular/core';

// @Service()
// export class InventoryService {}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private baseUrl = '/api/inventory';

  constructor(private http: HttpClient) { }

  getItems(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getItem(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
