import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkToken());

  constructor(private http: HttpClient, private router: Router) { }

  private checkToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Method to send a POST request to the server to log in the user
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, { username, password });
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
    return this.checkToken();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user ? user.id : null;
  }


  // Method to log out the user. Need to implement in HTML
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Notify subscribers that the user has logged out
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/auth']);
  }

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }
  public isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.isAdmin === true;
  }


}
