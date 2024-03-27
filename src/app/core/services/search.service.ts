import { Injectable } from '@angular/core';
import { Observable, of, combineLatest, map } from 'rxjs';
import { CategoryService } from './category.service';
import { ProjectService } from './project.service';
import { Category } from '../../shared/models/category.model';
import { Project } from '../../shared/models/project.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private http: HttpClient) {}

  searchCategories(query: string): Observable<Category[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<Category[]>(`${environment.apiUrl}/search/categories`, { params: { query } });
  }

  searchProjects(query: string): Observable<Project[]> {
    if (!query.trim()) {
      return of([]);
    }
    return this.http.get<Project[]>(`${environment.apiUrl}/search/projects`, { params: { query } });
  }
  searchAll(query: string): Observable<{ categories: Category[], projects: Project[] }> {
    if (!query.trim()) {
      return of({ categories: [], projects: [] });
    }

    const categoriesUrl = `${environment.apiUrl}/categories/search`;
    const projectsUrl = `${environment.apiUrl}/projects/search`;

    const categories$ = this.http.get<Category[]>(categoriesUrl, { params: { query } });
    const projects$ = this.http.get<Project[]>(projectsUrl, { params: { query } });

    return combineLatest([categories$, projects$]).pipe(
      map(([categories, projects]) => {
        return { categories, projects };
      })
    );
  }
}


