import { Component, OnInit } from '@angular/core';

import { ProfileService } from '../../core/services/profile.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { FavoritesBoardService } from '../../core/services/favorites-board.service';
import { ProjectService } from '../../core/services/project.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, RouterModule, LazyLoadImageModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {
  profile: any = { user: {} };
  editing: boolean = false;
  selectedFile: File | null = null;
  favoriteProjects: any[] = [];

  constructor(
    private profileService: ProfileService,
    private http: HttpClient,
    private userService: UserService,
    public authenticationService: AuthenticationService,
    private router: Router,
    private favoritesBoardService: FavoritesBoardService,
    private projectService: ProjectService) {}

  ngOnInit() {
    this.getProfile();
    this.getFavoriteProjects();
  }

  // Method to fetch the user's profile data.
  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
      },
      error: (error) => {
      }
    });
  }

  // Method to toggle the editing state of the profile.
  toggleEdit() {
    this.editing = !this.editing;
  }

  // Method to update the user's profile data with new data.
  updateProfile(): void {
    const formData = new FormData();
    formData.append('profile[bio]', this.profile.bio);

    if (this.selectedFile) {
      formData.append('profile[profile_picture]', this.selectedFile);
    } else if (this.profile.profilePictureUrl === null) {
      formData.append('profile[remove_profile_picture]', '1');
    }

    const userId = this.authenticationService.getCurrentUserId();
    if (userId) {
      this.profileService.updateProfile(userId, formData).subscribe(data => {
        console.log('Profile updated successfully');
        this.toggleEdit();
        this.getProfile();
      });
    } else {
      console.error('No user ID found');
    }
  }

  // Method to remove profile picture.
  removeProfilePicture(): void {
    this.selectedFile = null;
    this.profile.profilePictureUrl = null;
  }

  // Method to save the profile data.
  saveProfile(): void {
    this.updateProfile();
  }

  // Method to handle file selection for the profile picture uploaded.
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  // Method to navigate to the project details page.
  goToProjectDetails(projectId: number) {
    this.router.navigate(['/project-detail', projectId]);
  }

// Method to fetch the user's favorite projects.
getFavoriteProjects() {
  const userId = this.authenticationService.getCurrentUserId();
  if (userId) {
    this.userService.getFavoriteProjects(userId).subscribe({
      next: (favorites) => {
        this.favoriteProjects = favorites.map((favorite: any) => {
          return {
            id: favorite.id,
            title: favorite.title,
            description: favorite.description,
            image_url: favorite.image_url,
            favoriteId: favorite.favorite_id,
            inPlanner: favorite.status === 'wantToDo' || favorite.status === 'done'
          };
        });
        console.log('Favorite Projects with IDs:', this.favoriteProjects);
      },
      error: (error) => console.error('Error fetching favorite projects', error)
    });
  } else {
    console.error('No user ID found');
  }
}

// Method to categorize the project for the project planner
  categorizeProject(event: Event, favoriteId: number, status: 'wantToDo' | 'done' | 'unclassified'): void {
    event.stopPropagation();
    const project = this.favoriteProjects.find(p => p.favoriteId === favoriteId);
    if (!project) return;
    this.favoritesBoardService.categorizeFavorite(favoriteId, status, () => {
      project.inPlanner = status !== 'unclassified';
    });
  }
}


