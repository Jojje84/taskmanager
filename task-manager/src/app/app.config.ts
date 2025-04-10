import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importera `provideHttpClient` och `withFetch`
import { provideRouter } from '@angular/router';  // För att konfigurera routing
import { routes } from './app.routes';  // Importera dina rutter

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),  // Konfigurera routing
    provideHttpClient(withFetch())  // Konfigurera HttpClient med fetch istället för XMLHttpRequest
  ]
};
