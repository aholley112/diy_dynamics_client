import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UserService } from '../../../core/services/user.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Profile } from '../../models/profile.model';
import { Observable } from 'rxjs';
import { AuthComponent } from '../../../features/auth/auth.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, RouterModule, AuthComponent, MatTooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavigationBarComponent implements OnInit {
  searchText: string = '';
  userProfile: Profile | null = null;
  isLoggedIn$: Observable<boolean>;
  showAuthForm = false;
  authAction: 'sign-up' | 'log-in' = 'log-in';
  isLoading = false;
  showSearchBar = false;
  showExploreMenu: boolean = false;

  @Output() search = new EventEmitter<string>();

  constructor(public authService: AuthenticationService, private router: Router, private userService: UserService, private profileService: ProfileService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$; // subscribe to the isLoggedIn$ observable for authentication status
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.loadUserProfile();
      } else {
        this.userProfile = null;
      }
    });
        this.profileService.profileUpdated.subscribe(() => {
          this.loadUserProfile();
        });
      }

  // Method to load the user profile
  loadUserProfile(): void {
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
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/search'], { queryParams: { query: this.searchText } });
        this.searchText = '';
      } else {
        this.authService.setPendingSearchQuery(this.searchText);
        this.showAuthForm = true;
        this.authAction = 'log-in';
      }
    }
  }

  // Method to handle login success and navigate to pending search query
  onLoginSuccess(): void {
    const pendingQuery = this.authService.getPendingSearchQuery();
    if (pendingQuery) {
      this.router.navigate(['/search'], { queryParams: { query: pendingQuery } });
      this.authService.clearPendingSearchQuery();
    } else {
      this.router.navigate(['/default-route']);
    }
  }


  // Method to clear the search text
  clearSearch(): void {
    this.searchText = '';
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Method to logout the user
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // Method to go to the user profile
  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Method to go to categories
  goToCategories(): void {
    this.router.navigate(['/categories']);
  }

  // Method to go to projects
  goToProjects(): void {
    this.router.navigate(['/projects']);
  }

  // Method to go to saved projects
  goToSavedProjects(): void {
  this.router.navigate(['/profile'], { queryParams: { tab: 'saved' } });
}

// Method to go to the home page
goToHome(): void {
  this.router.navigate(['home']);
}

// Method to go to the project planner
goToProjectPlanner(): void {
  this.router.navigate(['project-planner']);
}

// Method to toggle the authentication form
toggleAuthForm(action: 'sign-up' | 'log-in', intendedRoute: string): void {
  if (this.authService.isLoggedIn()) {
    this.router.navigate([intendedRoute]);
  } else {
  this.authAction = action;
  this.showAuthForm = true;
}
}

// Method to togglge the search bar for mobile view
toggleSearchBar(): void {
  this.showSearchBar = !this.showSearchBar;
}

// Host listener to adjust based on window size.
@HostListener('window:resize')
onWindowResize() {
  if (window.innerWidth > 600) {
    this.showSearchBar = false;
    this.showExploreMenu = false;
  }
}

// Method to check if the window is mobile
isMobile(): boolean {
  return window.innerWidth <= 600;
}

// Method to toggle the explore menu
toggleExploreMenu(): void {
  this.showExploreMenu = !this.showExploreMenu;
}

// Method to navigate and close the menu
navigateAndCloseMenu(path: string): void {
  this.router.navigate([path]);
  this.showExploreMenu = false;
}

// Method to handle login success
handleLoginSuccess(): void {
  const pendingQuery = this.authService.getPendingSearchQuery();
  if (pendingQuery) {
    this.router.navigate(['/search'], { queryParams: { query: pendingQuery } });
    this.authService.clearPendingSearchQuery();
  } else {
    this.router.navigate(['/home']);
  }
}
}
