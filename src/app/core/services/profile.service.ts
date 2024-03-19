import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }
 updateProfile(userId: number, profileData: FormData): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/users/${userId}/profile`, profileData);
}
}
