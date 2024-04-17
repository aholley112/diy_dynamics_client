import { Component, Input, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';

import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/models/category.model';

@Component({
  selector: 'app-category-projects',
  standalone: true,
  imports: [LazyLoadImageModule, RouterModule],
  templateUrl: './category-projects.component.html',
  styleUrl: './category-projects.component.scss'
})
export class CategoryProjectsComponent implements OnInit {
  projects: Project[] = [];
  categoryTitle: string = '';



  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const categoryId = +params['category_id'];
      if (!isNaN(categoryId)) {
        console.log('Loading category details for ID:', categoryId);
        this.loadCategoryDetails(categoryId);
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

  loadCategoryDetails(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (category: Category) => {
        this.categoryTitle = category.category_name;
        this.loadProjectsForCategory(categoryId);
      },
      error: (error: any) => console.error('Error fetching category details', error)
    });
  }
}

