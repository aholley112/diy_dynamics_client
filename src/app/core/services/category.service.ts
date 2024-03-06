import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  // Fetch all categories from the backend
  getCategories(): Observable<Category[]> {
    const token = this.authService.getToken();

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.get<Category[]>(this.apiUrl, httpOptions);
  }

  // Search for categories by name or other criteria
  searchCategories(term: string): Observable<Category[]> {
    const searchUrl = `${this.apiUrl}/search?term=${term}`;
    return this.http.get<Category[]>(searchUrl);
  }
}
