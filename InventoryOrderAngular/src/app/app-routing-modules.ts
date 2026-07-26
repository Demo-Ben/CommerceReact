//project does NOT use NgModules
// ← this is NOT a real Angular module

import { Routes } from '@angular/router';

import { InventoryComponent } from './pages/inventory/inventory.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { PaymentComponent } from './pages/payments/payments.component';

export const routes: Routes = [
    { path: 'inventory', component: InventoryComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'payments', component: PaymentComponent },

    // default route
    { path: '', redirectTo: 'inventory', pathMatch: 'full' },

    // Catch-all route (optional)
    { path: '**', redirectTo: 'inventory' }
];
