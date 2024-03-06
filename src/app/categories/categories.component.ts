import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../core/services/category.service';
import { Category } from '../shared/models/category.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('There was an error fetching the categories', error);
      }
    );
  }
  selectCategory(category: Category): void {
    this.router.navigate(['/categories', category.id]);
  }
}