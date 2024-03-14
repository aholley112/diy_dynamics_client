import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Category } from '../models/category.model';
import { AuthenticationService } from '../../core/services/authentication.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavigationBarComponent {
  searchText: string = '';
  searchResults: Category[] = [];

  @Output() search = new EventEmitter<string>();

  constructor(public authService: AuthenticationService, private router: Router) {}

  searchCategories(): void {
    console.log('Emitting search text:', this.searchText);
    this.search.emit(this.searchText);
  }

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

  clearSearch(): void {
    this.searchText = '';
  }

}
