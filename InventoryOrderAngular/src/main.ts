import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app-module';

//Angular tries to bootstrap the app 
bootstrapApplication(AppComponent, appConfig)   // ← breakpoint
  .catch(err => console.error(err));


// import { platformBrowser } from '@angular/platform-browser';
// import { AppModule } from './app/app-module';

// platformBrowser().bootstrapModule(AppModule, {

// })
//   .catch(err => console.error(err));


