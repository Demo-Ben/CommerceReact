import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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


// How the Match Works: Exact Case Sensitivity, Curly Braces { }, Correct File Path
// my-component.component.ts file
// export class MyComponent { ... }

// my-component.component.spec.ts
// import { MyComponent } from './my-component.component';
