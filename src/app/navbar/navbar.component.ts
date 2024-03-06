import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../shared/models/category.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavigationBarComponent {
  searchText: string = '';
  searchResults: Category[] = [];

  @Output() search = new EventEmitter<string>();

  constructor(private router: Router){}

  searchCategories(): void {
    console.log('Emitting search text:', this.searchText);
    this.search.emit(this.searchText);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
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
