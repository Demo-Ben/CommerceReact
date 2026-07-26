// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { PaymentComponent } from './payments.component';

// describe('PaymentsComponent', () => {
//   let component: PaymentComponent;
//   let fixture: ComponentFixture<PaymentComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [PaymentComponent],
//     }).compileComponents();

//     fixture = TestBed.createComponent(PaymentComponent);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { PaymentComponent } from './payments.component';
import { PaymentsService } from '../../services/payments.service';

describe('PaymentComponent', () => {
    let component: PaymentComponent;
    let fixture: ComponentFixture<PaymentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                PaymentComponent,        // ← standalone component
                HttpClientTestingModule  // ← required for service injection
            ],
            providers: [
                PaymentsService          // ← inject your service
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PaymentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
