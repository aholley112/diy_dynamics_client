import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { Project } from '../shared/models/project.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const projectId = +params['id'];
      this.fetchProject(projectId);
    });
  }

  fetchProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => this.project = project,
      error: (error) => console.error('Error fetching project details', error)
    });
  }
}
