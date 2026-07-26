import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface InventoryItem {
    id: number;
    name: string;
    price: number;
    stock: number;
}

@Injectable({
    providedIn: 'root'
})
export class InventoryService {

    private baseUrl = 'https://localhost:5003/inventory';
    //private baseUrl = environment.inventoryApi;

    constructor(private http: HttpClient) { }

    getItems(): Observable<InventoryItem[]> {
        console.log("InventoryService.getItems() called");   // ← FIRST BREAKPOINT

        var rtn = this.http.get<InventoryItem[]>(this.baseUrl);
        return rtn;
    }

    getItem(id: number): Observable<InventoryItem> {

        return this.http.get<InventoryItem>(`${this.baseUrl}/${id}`);
    }
}
