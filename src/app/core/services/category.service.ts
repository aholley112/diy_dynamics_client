import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../shared/models/category.model';
import { AuthenticationService } from './authentication.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CategoryService{

  constructor(private http: HttpClient, private authService: AuthenticationService) {}

  // Fetch all categories from the backend
  getCategories(): Observable<Category[]> {
    const token = this.authService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`, httpOptions);
  }

  // Search for categories by name or related word
  searchCategories(term: string): Observable<Category[]> {
    const searchUrl = `${environment.apiUrl}/categories/search?term=${term}`;
    return this.http.get<Category[]>(searchUrl);
  }

   // Fetch a single category by ID
  getCategoryById(categoryId: number): Observable<Category> {
    const token = this.authService.getToken();
    const httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `Bearer ${token}`
        })
    };
    return this.http.get<Category>(`${environment.apiUrl}/categories/${categoryId}`, httpOptions);
}

}
