import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../core/services/profile.service';
import { NavigationBarComponent } from '../../shared/components/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router, RouterModule } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavigationBarComponent, FormsModule, RouterModule, LazyLoadImageModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  profile: any = { user: {} };
  editing: boolean = false;
  selectedFile: File | null = null;
  favoriteProjects: any[] = [];

  constructor(private profileService: ProfileService, private http: HttpClient, private userService: UserService, public authenticationService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    console.log('ProfileComponent ngOnInit started');
    console.log('Is Admin:', this.authenticationService.isAdmin());

    // Fetches the user's profile data on component initialization.
    this.getProfile();
    // Fetches the user's favorite projects on component initialization.
    this.getFavoriteProjects();
    console.log('ProfileComponent ngOnInit completed');
  }


  // Method to fetch the user's profile data.
  getProfile() {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        console.log('Profile data fetched:', data);
        this.profile = data;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
      }
    });
  }


  // Method to toggle the editing state of the profile.
  toggleEdit() {
    this.editing = !this.editing;
  }

  // Method to update the user's profile data with new data.
  updateProfile() {
    const formData = new FormData();
    formData.append('profile[bio]', this.profile.bio);

    if (this.selectedFile) {
      formData.append('profile[profile_picture]', this.selectedFile);
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

  // Method to handle file selection for the profile picture uploaded.
  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];
    }
  }

  goToProjectDetails(projectId: number) {
    this.router.navigate(['/project-detail', projectId]);
  }

// Method to fetch the user's favorite projects.
getFavoriteProjects() {
  const userId = this.authenticationService.getCurrentUserId();
  if (userId) {
    this.userService.getFavoriteProjects(userId).subscribe({
      next: (projects) => {
        console.log('Favorite Projects:', projects);
        this.favoriteProjects = projects.map((project: any) => {
          return {
            ...project,
            image_url: project.image_url ? project.image_url : 'default_image_url_here'
          };
        });
      },
      error: (error) => console.error('Error fetching favorite projects', error)
    });
  } else {
    console.error('No user ID found');
  }
}
}
