// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-inventory',
//   standalone: false,
//   templateUrl: './inventory.component.html',
//   styleUrl: './inventory.component.css',
// })
// export class InventoryComponent {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  inventory: InventoryItem[] = [];
  selectedId: number | null = null;
  quantity: number = 1;

  constructor(private inventoryService: InventoryService,
            private ordersService: OrdersService)
  {
    console.log("InventoryComponent constructor fired");   // ← breakpoint #1
  }

  // ngOnInit(): void {
  //   this.loadInventory();
  // }

  ngOnInit(): void {
    console.log("InventoryComponent ngOnInit fired");       // ← breakpoint #2

    this.inventoryService.getItems().subscribe(items => {
      console.log("InventoryService returned items:", items); // ← breakpoint #3
      this.inventory = items;
    });

    // setTimeout(() => {
    //   this.inventoryService.getItems().subscribe(items => {
    //     console.log("Items:", items);
    //     this.inventory = items;
    //   });
    // }, 2000);   // 2‑second delay
  }

  loadInventory(): void {
    this.inventoryService.getItems().subscribe(items => {
      this.inventory = items;
    });
  }

  createOrder(): void {
    if (!this.selectedId) return;

    this.ordersService.createOrder(this.selectedId, this.quantity)
      .subscribe(() => {
        this.quantity = 1;
        this.loadInventory();
      });
  }
}
