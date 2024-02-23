import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) { }
login (username:string, password:string) {
  return this.http.post<{token:string}>(`${environment.apiUrl}/login`,
  {
    username,
    password
  })
}
setToken(token: string) {
  localStorage.setItem('token', token)
}

getToken() {
  return localStorage.getItem('token')
}

isLoggedIn() {
  return !!localStorage.getItem('token')
}

logout() {
  localStorage.removeItem('token')
  this.router.navigate(['/login'])
}
}


