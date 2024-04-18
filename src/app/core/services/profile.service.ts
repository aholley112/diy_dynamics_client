import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Profile } from '../../shared/models/profile.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  profileUpdated = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  // Method to get the user's profile data
  getProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${environment.apiUrl}/profile`);
  }

  // Method to update the user's profile data
 updateProfile(userId: number, profileData: FormData): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/users/${userId}/profile`, profileData).pipe(
    tap(() => {
      this.profileUpdated.emit();
    })
  );
}
}
