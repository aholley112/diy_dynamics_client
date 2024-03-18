import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { Project } from '../shared/models/project.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      this.fetchProject(projectId);
    });
  }

  // Method to fetch the project details from the API
  fetchProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.project = project;
      },
      error: (error) => console.error('Error fetching project details', error)
    });
  }

  // Method to add the project to the user's favorites
  addToFavorites(): void {
    if (this.project) {
      this.userService.addProjectToFavorites(this.project.id).subscribe({
        next: () => {
          console.log('Added to favorites');
          this.isFavorite = true;
        },
        error: (error) => console.error('Error adding to favorites', error)
      });
    }
  }

  // Method to remove the project from the user's favorites
  removeFromFavorites(): void {
    if (this.project) {
      this.userService.removeProjectFromFavorites(this.project.id).subscribe({
        next: () => {
          console.log('Removed from favorites');
          this.isFavorite = false;
        },
        error: (error) => console.error('Error removing from favorites', error)
      });
    }
  }
}
