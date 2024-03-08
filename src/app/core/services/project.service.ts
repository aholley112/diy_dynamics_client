import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // getFeaturedProjects(): Observable<Project[]> {
  //   return this.http.get<Project[]>(`${this.apiUrl}/featured`);
  // }

  // getProjectById(id: number): Observable<Project> {
  //   return this.http.get<Project>(`${this.apiUrl}/${id}`);
  // }

  toggleFavorite(projectId: number): Observable<Project> {
    return this.http.patch<Project>(`${environment.apiUrl}/${projectId}/toggle_favorite`, {});
  }
  // addProject(projectData: Project): Observable<Project> {
  //   // Add a new project
  //   return this.http.post<Project>(this.apiUrl, projectData);
  // }

  // updateProject(projectId: number, projectData: Project): Observable<Project> {
  //   // Update an existing project
  //   return this.http.put<Project>(`${this.apiUrl}/${projectId}`, projectData);
  // }

  // deleteProject(projectId: number): Observable<void> {
  //   // Delete a project
  //   return this.http.delete<void>(`${this.apiUrl}/${projectId}`);
  // }

}
