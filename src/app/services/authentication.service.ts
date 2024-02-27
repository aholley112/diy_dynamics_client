import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string) {
    return this.http.post<{token: string}>(`${environment.apiUrl}/login`, {
      username,
      password
    });
  }

  signup(firstName: string, lastName: string, email: string, password: string) {
    // Adjust the URL and the body as necessary for your backend implementation
    return this.http.post<{message: string, user: any}>(`${environment.apiUrl}/signup`, {
      firstName,
      lastName,
      email,
      password
    });
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
