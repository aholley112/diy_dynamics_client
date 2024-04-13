import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@Component({
  selector: 'app-category-projects',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule, RouterModule],
  templateUrl: './category-projects.component.html',
  styleUrl: './category-projects.component.scss'
})
export class CategoryProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = +params['category_id'];
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

  // Callback for when project images have loaded.
  onImageLoad(project: any): void {
    setTimeout(() => {
      project.is_loading = false;
    }, 2000); // 2 seconds delay
  }

  // Method to fetch the projects from the API
  loadProjectsForCategory(categoryId: number): void {
    this.projectService.getProjectsByCategory(categoryId).subscribe({
      next: (projects) => {
        this.projects = projects.map(project => ({
          ...project,
          is_loading: true
        }));
        console.log('Projects fetched:', this.projects);
      },
      error: (error) => console.error('Error fetching projects for category', error)
    });
  }
}

