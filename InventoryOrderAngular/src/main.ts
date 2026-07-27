// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app-module';

// //Angular tries to bootstrap the app 
// bootstrapApplication(AppComponent, appConfig)   // ← breakpoint
//     .catch(err => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routing-modules';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient()
    ]
});


