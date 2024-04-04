import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/current`);
  }
  createFavorite(projectId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/create_favorite`, {});
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users/${userId}/profile`);
  }
  getFavoriteProjects(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users/${userId}/favorites`);
  }

  addProjectToFavorites(projectId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/add_to_favorites`, {});
}

  removeProjectFromFavorites(favoriteId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${favoriteId}/remove_from_favorites`);
  }

}
