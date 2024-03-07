// import { Injectable } from '@angular/core';
// import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {

//   constructor() {}

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // Clone the request to add the new header.
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${this.getAuthToken()}`)
//     });

//     // Pass on the cloned request instead of the original request.
//     return next.handle(authReq);
//   }

//   private getAuthToken(): string {
//     // Implement function to retrieve your token
//     return 'your-auth-token';
//   }
// }
