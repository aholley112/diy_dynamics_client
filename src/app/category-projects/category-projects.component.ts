import { Component, OnInit } from '@angular/core';
import { Project } from '../shared/models/project.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-projects.component.html',
  styleUrl: './category-projects.component.scss'
})
export class CategoryProjectsComponent implements OnInit {
  // The list of projects to be displayed
  projects: Project[] = [];

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) {}

  // Fetch the projects when the component is initialized
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = +params['id'];
      if (!isNaN(categoryId)) {
        this.loadProjectsForCategory(categoryId);
      } else {
        console.error('Invalid category ID');
      }
    });
  }
  // Method to navigate to project detail page
  viewProject(projectId: number): void {
    this.router.navigate(['/project-detail', projectId]);
  }

  // Method to fetch the projects from the API
  loadProjectsForCategory(categoryId: number): void {
    this.projectService.getProjectsByCategory(categoryId).subscribe({
      next: (projects) => this.projects = projects,
      error: (error) => console.error('Error fetching projects for category', error)
    });
  }
}
