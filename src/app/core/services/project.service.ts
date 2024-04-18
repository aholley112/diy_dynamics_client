import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { Project } from '../../shared/models/project.model';
import { environment } from '../../../environments/environment';
import { Comment } from '../../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) {}

  // Method to get all projects
  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/projects`);
  }

  // Method to get projects by category
  getProjectsByCategory(categoryId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/categories/${categoryId}/projects`);
  }

  // Method to get project by ID
  getProjectById(id: number, userId?: number): Observable<Project> {
    let headers = new HttpHeaders();
    if (userId) {
      headers = headers.set('User-ID', userId.toString());
    }
    return this.http.get<Project>(`${environment.apiUrl}/projects/${id}`, { headers: headers });
  }

  // Method to create project
  createProject(formData: FormData): Observable<Project> {
    return this.http.post<Project>(`${environment.apiUrl}/projects`, formData);
  }

  // Method to update project
  updateProject(projectId: number, projectData: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/projects/${projectId}`, projectData);
  }

  // Method to search for projects
  searchProjects(query: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/search/projects`, {
      params: { query: query }
    });
  }

  // Method to get favorite projects
  getFavoriteProjects(userId: number): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/users/${userId}/favorite-projects`);
  }

  // Method to get comments
  getCommentsByProjectId(projectId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${environment.apiUrl}/projects/${projectId}/comments`);
  }

  // Method to add comment
  addComment(projectId: number, commentData: { text: string }): Observable<Comment> {
    return this.http.post<Comment>(`${environment.apiUrl}/projects/${projectId}/comments`, commentData);
  }

  // Method to update comments
  updateComment(projectId: number, commentId: number, commentData: { text: string }): Observable<Comment> {
    return this.http.put<Comment>(`${environment.apiUrl}/projects/${projectId}/comments/${commentId}`, commentData);
  }

  // Method to delete comments
  deleteComment(projectId: number, commentId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/projects/${projectId}/comments/${commentId}`);
  }

  // Method to add a like to a project
  addLike(projectId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/likes`, {});
  }

  // Method to remove a like from a project
  removeLike(likeId: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/likes/${likeId}`);
  }

  // Method update to add or remove from the project planner.
  updatePlannerStatus(projectId: number, isInPlanner: boolean): Observable<any> {
    const url = `${environment.apiUrl}/projects/${projectId}/${isInPlanner ? 'add_to_planner' : 'remove_from_planner'}`;
    return this.http.post(url, {});
  }
}
