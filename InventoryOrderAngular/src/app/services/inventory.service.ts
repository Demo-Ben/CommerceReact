import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // private baseUrl = '/api/inventory';
  private baseUrl = 'https://localhost:5003/inventory';
  //private baseUrl = environment.inventoryApi;

  constructor(private http: HttpClient) { }

  getItems(): Observable<InventoryItem[]> {

    console.log("InventoryService.getItems() called");   // ← FIRST BREAKPOINT
    return this.http.get<InventoryItem[]>(this.baseUrl);
  }

  getItem(id: number): Observable<InventoryItem> {

    return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`);
  }
}
