import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { Router, RouterModule } from '@angular/router';
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
  showCreateProjectForm: boolean = false;

  constructor(private projectService: ProjectService, private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  // Method to load projects
  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects.map(project => ({
          ...project,
          is_loading: true,
          est_time_to_completion: this.mapTimeToCategory(project.est_time_to_completion)
        }));
        console.log('Mapped Projects:', this.projects);

        // apply filters to project list.
        this.applyFilters();
        this.estimatedTimes = ['1 hour', '2 hours', '3+ hours'];
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }

  // Method to map numeric time to category string
  mapTimeToCategory(time: string): string {
    const hours = parseFloat(time);
    if (hours <= 1) {
      return '1 hour';
    } else if (hours <= 2) {
      return '2 hours';
    } else {
      return '3+ hours';
    }
  }

  // Method to handle image load
  onImageLoad(project: Project): void {
    setTimeout(() => {
      project.is_loading = false;
    }, 5000);
  }

  // Method to filter projects based on selected time
  applyFilters(): void {
    console.log('Selected Time:', this.selectedTime);
    this.filteredProjects = this.projects.filter(project => {
      const timeMatch = this.selectedTime ? project.est_time_to_completion === this.selectedTime : true;
      return timeMatch;
    });
    console.log('Filtered Projects:', this.filteredProjects);
  }

  // Method to open create project form
  openCreateProjectForm() {
    this.router.navigate(['/create-project']);
    this.showCreateProjectForm = true;
  }

  // Method to close create project form
  closeCreateProjectForm() {
    this.showCreateProjectForm = false;
  }
}

