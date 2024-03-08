import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/models/project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../core/services/project.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService, private router: Router) {} 

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (projects) => this.projects = projects,
      error: (error) => console.error('Error loading projects', error)
    });
  }
  viewProject(projectId: number): void {
    this.router.navigate(['/projects', projectId]);
  }

  toggleFavorite(projectId: number): void {
    this.projectService.toggleFavorite(projectId).subscribe({
      next: (updatedProject: Project) => {
        const index = this.projects.findIndex(project => project.id === updatedProject.id);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }
      },
      error: (error) => {
        console.error('Error toggling favorite status', error);
      }
    });
  }
}

