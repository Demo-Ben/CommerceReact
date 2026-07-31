import { TestBed } from '@angular/core/testing';

import { OrdersService } from './orders.service';

describe('OrdersService', () => {
    let service: OrdersService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OrdersService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});


// You execute all .spec.ts files across your project by running the terminal command:
// ng test
// Note: By default, the ng test command runs all test files (.spec.ts) across your entire project at the same time
//
// or Target a Specific File
// ng test--include = src / app / components / user /

// Generate component withou test file
// ng generate component my-component --skip-tests
