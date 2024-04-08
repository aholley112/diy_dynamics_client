import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/models/project.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isFavorite: boolean = false;
  currentUserId: number | null = null;
  favoriteId: number | null = null;
  favoriteProjectIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authenticationService.getCurrentUserId();
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      if (!isNaN(projectId)) {
      this.fetchProject(projectId);
    } else {
      console.error('Invalid project ID');
    }
    });
  }

  // Method to fetch the project details
  fetchProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project: any) => {
        this.project = project;
        this.isFavorite = project.is_favorite_project;
        this.favoriteId = project.favorite_id;

        project.material_names = Array.isArray(project.material_names)
        ? project.material_names.join(', ')
        : project.material_names;

      project.tool_names = Array.isArray(project.tool_names)
        ? project.tool_names.join(', ')
        : project.tool_names;
      },
      error: (error) => console.error('Error fetching project details', error)
    });
  }

  isProjectFavorite(projectId: number): boolean {
    return this.favoriteProjectIds.includes(projectId);
  }

  // Method to add the project to the user's favorites
  addToFavorites(): void {
    if (this.project) {
      this.userService.addProjectToFavorites(this.project.id).subscribe({
        next: (response) => {
          console.log('Added to favorites');
          this.isFavorite = true;
          this.favoriteId = response.favorite_id;
          if (this.project) {
            this.fetchProject(this.project.id);
          }
        },
        error: (error) => console.error('Error adding to favorites', error)
      });
    }
  }

  // Method to remove the project from the user's favorites
  removeFromFavorites(): void {
    if (this.project && this.favoriteId != null) {
      this.userService.removeProjectFromFavorites(this.favoriteId).subscribe({
        next: () => {
          console.log('Removed from favorites');
          this.isFavorite = false;
          if (this.project) {
            this.fetchProject(this.project.id);
          }
        },
        error: (error) => console.error('Error removing from favorites', error)
      });
    }
  }

  }
