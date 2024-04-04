import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { FavoriteProject } from '../../shared/models/favorite-project.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesBoardService {
  private wantToDoProjects = new BehaviorSubject<Project[]>([]);
  private doneProjects = new BehaviorSubject<Project[]>([]);

  wantToDoProjects$ = this.wantToDoProjects.asObservable();
  doneProjects$ = this.doneProjects.asObservable();

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  categorizeFavorite(favorite_Id: number, status: 'wantToDo' | 'done'): void {
    console.log(`Categorizing favorite ${favorite_Id} as ${status}`);
    this.updateFavoriteStatus(favorite_Id, status).subscribe({
      next: (response) => {
        console.log('Favorite status update response:', response);

        const userId = this.authService.getCurrentUserId();
        if (userId !== null) {
          this.refreshFavorites(userId);
        } else {
          console.error('User ID is null');
        }
      },
      error: error => console.error('Error updating favorite status', error)
    });
  }


  refreshFavorites(userId: number): void {
    this.http.get<FavoriteProject[]>(`${environment.apiUrl}/users/${userId}/favorites`).subscribe(favorites => {
      console.log('Fetched favorites:', favorites);
      const wantToDoProjects = favorites.filter(f => f.status === 'wantToDo');
      const doneProjects = favorites.filter(f => f.status === 'done');
      console.log('Refreshed Want To Do Projects:', wantToDoProjects);
        console.log('Refreshed Done Projects:', doneProjects);

      this.wantToDoProjects.next(wantToDoProjects);
      this.doneProjects.next(doneProjects);
    });
  }

  updateFavoriteStatus(favoriteId: number, newStatus: 'wantToDo' | 'done'): Observable<any> {
    return this.http.put(`${environment.apiUrl}/favorites/${favoriteId}/status`, { status: newStatus });
}

}

