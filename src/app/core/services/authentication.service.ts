import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) { }

  // Method to send a POST request to the server to log in the user
  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/login`, { username, password }).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        this.setToken(res.token);

        if (res.user) {
          console.log('Storing user details:', res.user);
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.router.navigate(['/home']);
        } else {
          console.error('User details are missing in the login response');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }
  // Method to send a POST request to the server to sign up the user
  signup(firstName: string, lastName: string, email: string, username: string, password: string) {
    return this.http.post<{message: string, user: any}>(`${environment.apiUrl}/signup`, {
      first_name: firstName,
      last_name: lastName,
      email: email,
      username: username,
      password: password
    });
  }
  // Method to save the JWT token in local storage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Method to retrieve the JWT token from local storage
  getToken() {
    return localStorage.getItem('token');
  }

  // Method to check if the user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }
  getCurrentUserId(): number | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      return user ? user.id : null;
    }
    return null;
  }

  // Method to log out the user. Need to implement in HTML
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }
}
