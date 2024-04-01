import { Component, OnInit } from '@angular/core';
import { Project } from '../../shared/models/project.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../core/services/project.service';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, LazyLoadImageModule, NgxSkeletonLoaderModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (projects) => {
        this.projects = projects.map(project => ({
          ...project,
          isLoading: true
        }));
      },
      (error) => {
        console.error('Error fetching projects', error);
      }
    );
  }
  onImageLoad(project: Project): void {
    project.isLoading = false;
  }
  
}

