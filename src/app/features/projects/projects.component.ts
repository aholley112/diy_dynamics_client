import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../core/services/category.service';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, LazyLoadImageModule, NgxSkeletonLoaderModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  categories: Category[] = [];
  estimatedTimes: string[] = [];
  selectedCategory: string = '';
  selectedTime: string = '';


  constructor(private projectService: ProjectService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }


  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects.map(project => ({
          ...project,
          is_loading: true
        }));
        this.applyFilters();
        this.estimatedTimes = [...new Set(projects.map(project => project.est_time_to_completion))];
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  onImageLoad(project: Project): void {
    setTimeout(() => {
      project.is_loading = false;
    }, 5000);
  }

  applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const categoryMatch = this.selectedCategory ? project.categories?.some(category => category.id === this.selectedCategory) : true;
      const timeMatch = this.selectedTime ? project.est_time_to_completion === this.selectedTime : true;
      return categoryMatch && timeMatch;
    });
  }

}

