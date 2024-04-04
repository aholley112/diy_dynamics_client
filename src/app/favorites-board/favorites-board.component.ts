import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProjectService } from '../core/services/project.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../core/services/authentication.service';
import { FavoritesBoardService } from '../core/services/favorites-board.service';

@Component({
  selector: 'app-favorites-board',
  standalone: true,
  imports: [CommonModule, LazyLoadImageModule],
  templateUrl: './favorites-board.component.html',
  styleUrl: './favorites-board.component.scss'
})
export class FavoritesBoardComponent implements OnInit {
  wantToDoProjects: any[] = [];
  doneProjects: any[] = [];

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private favoritesBoardService: FavoritesBoardService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.refreshFavoriteProjects();
  }

  refreshFavoriteProjects(): void {
    const userId = this.authenticationService.getCurrentUserId();
    console.log('Current User ID:', userId);

    if (userId) {
      this.favoritesBoardService.refreshFavorites(userId);

      this.favoritesBoardService.wantToDoProjects$.subscribe(projects => {
        console.log('Want To Do Projects:', projects);
        this.wantToDoProjects = projects;
      });
      this.favoritesBoardService.doneProjects$.subscribe(projects => {
        console.log('Done Projects:', projects);
        this.doneProjects = projects;
      });
    }
  }

  onDragStart(event: DragEvent, project: any): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(project));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, status: 'wantToDo' | 'done'): void {
    event.preventDefault();
    const projectData = event.dataTransfer?.getData('text/plain');
    const project = projectData ? JSON.parse(projectData) : null;

    console.log('Dropped project data:', project);
    console.log('New status:', status);

    if (project && project.favoriteId) {
      this.favoritesBoardService.categorizeFavorite(project.favoriteId, status);
    }
  }
  goToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail', projectId]);
  }
}
