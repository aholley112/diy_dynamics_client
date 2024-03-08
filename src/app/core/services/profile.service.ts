import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }

  updateProfile(profileData: Profile): Observable<Profile> {
    return this.http.put<Profile>(`${environment.apiUrl}/users/profile`, profileData);
  }
}
