import { CommonModule } from '@angular/common';
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
  imports: [FormsModule, CommonModule, RouterModule, AuthComponent, MatTooltipModule],
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
    this.isLoggedIn$ = this.authService.isLoggedIn$;
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

goToProjectPlanner(): void {
  this.router.navigate(['project-planner']);
}

toggleAuthForm(action: 'sign-up' | 'log-in', intendedRoute: string): void {
  if (this.authService.isLoggedIn()) {
    this.router.navigate([intendedRoute]);
  } else {

  this.authAction = action;
  this.showAuthForm = true;
}
}

toggleSearchBar(): void {
  this.showSearchBar = !this.showSearchBar;
}

@HostListener('window:resize')
onWindowResize() {
  if (window.innerWidth > 600) {
    this.showSearchBar = false;
    this.showExploreMenu = false;
  }
}

isMobile(): boolean {
  return window.innerWidth <= 600;
}

toggleExploreMenu(): void {
  this.showExploreMenu = !this.showExploreMenu;
}

navigateAndCloseMenu(path: string): void {
  this.router.navigate([path]);
  this.showExploreMenu = false;
}

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
