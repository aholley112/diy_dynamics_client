import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {


  constructor(private http: HttpClient) {}

  // Fetch all projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  getProjectsByCategory(categoryId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/categories/${categoryId}/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/projects/${id}`);
  }
  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/projects`, formData);
  }

  updateProject(projectId: number, projectData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/projects/${projectId}`, projectData);
  }
  searchProjects(query: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/search/projects`, {
      params: { query: query }
    });
  }
  getFavoriteProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/users/${userId}/favorite-projects`);
  }
}
