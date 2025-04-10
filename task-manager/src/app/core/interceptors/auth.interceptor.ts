// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('authToken');  // Hämta token från localStorage

    // Om authToken finns, lägg till den i headern
    if (authToken) {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });

      return next.handle(clonedRequest);  // Skicka vidare den klonade förfrågan
    }

    return next.handle(request);  // Om ingen token, skicka originalförfrågan
  }
}
