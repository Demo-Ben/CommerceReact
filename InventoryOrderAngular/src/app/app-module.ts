import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app-routing-modules';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};





// import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing';
// import { App } from './app-component';

// import { HttpClientModule } from '@angular/common/http';
// import { RouterModule } from '@angular/router';

// @NgModule({
//   declarations: [
//     App
//   ],
//   imports: [
//     BrowserModule,
//     AppRoutingModule,
//     RouterModule,
//     HttpClientModule
//   ],
//   providers: [
//     provideBrowserGlobalErrorListeners(),
//   ],
//   bootstrap: [App]
// })
// export class AppModule { }

