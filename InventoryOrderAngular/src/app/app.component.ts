import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// import { RouterOutlet } from '@angular/router';
// import { provideRouter } from '@angular/router';
// import { HttpClientModule } from '@angular/common/http';
// import { routes } from './app-routing-modules';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        /* RouterOutlet, */
        // HttpClientModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    constructor() {
        console.log("AppComponent constructor fired");    // ← FIRST BREAKPOINT
    }

    ngOnInit(): void {
        console.log("AppComponent ngOnInit fired");       // ← ngOnInit breakpoint
    }
}
