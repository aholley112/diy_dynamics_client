import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Category } from '../../models/category.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../models/profile.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavigationBarComponent {
  searchText: string = '';
  userProfile: Profile | null = null;
  isLoggedIn$: Observable<boolean>;


  @Output() search = new EventEmitter<string>();

  constructor(public authService: AuthenticationService, private router: Router, private userService: UserService, private profileService: ProfileService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.loadUserProfile();
  }
  private loadUserProfile(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getProfile().subscribe({
        next: (profile) => {
          this.userProfile = profile;
        },
        error: (err) => {
          console.error('Failed to load user profile', err);
        }
      });
    }
  }

  // Method to search for categories
  searchCategories(): void {
    if (this.searchText.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchText } });
      this.searchText = '';
    }
  }

  // Method to clear the search text
  clearSearch(): void {
    this.searchText = '';
  }


  // Method to navigate to the auth page
  goToAuth(mode: 'log-in' | 'sign-up'): void {
    console.log('Attempting to navigate to auth with mode:', mode);
    this.router.navigate(['/auth'], { queryParams: { action: mode } });
  }


  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }


  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

goToSavedProjects(): void {
  this.router.navigate(['/profile'], { queryParams: { tab: 'saved' } });
}

goToHome(): void {
  this.router.navigate(['home']);
}
}
