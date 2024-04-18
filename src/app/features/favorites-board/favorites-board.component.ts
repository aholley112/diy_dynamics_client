import { Component, OnInit } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProjectService } from '../../core/services/project.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../core/services/authentication.service';
import { FavoritesBoardService } from '../../core/services/favorites-board.service';

@Component({
  selector: 'app-favorites-board',
  standalone: true,
  imports: [LazyLoadImageModule],
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

  // Method to refresh the favorite projects
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

  // Method to handle the drag start event
  onDragStart(event: DragEvent, project: any): void {
    console.log(`Dragging project with favoriteId: ${project.favorite_id}`);
    if (project.favorite_id) {
      event.dataTransfer?.setData('text/plain', project.favorite_id.toString());
    } else {
      console.log('No favoriteId found for project:', project);
    }
  }

  // Method to handle the drag over event
  onDragOver(event: DragEvent) {
    event.preventDefault();
    }

// Method to handle the drop event
onDrop(event: DragEvent, newStatus: 'wantToDo' | 'done'): void {
  event.preventDefault();
  const favoriteId = event.dataTransfer?.getData('text/plain');
  console.log('Dropped favoriteId:', favoriteId);
  if (favoriteId) {
    console.log('Updating status for favoriteId:', favoriteId, 'to', newStatus);
    this.favoritesBoardService.categorizeFavorite(parseInt(favoriteId, 10), newStatus);
  } else {
    console.error('Invalid favoriteId received on drop:', favoriteId);
  }
}

  // Method to navigate to the project details page
  goToProjectDetails(projectId: number): void {
    this.router.navigate(['/project-detail', projectId]);
  }
}
