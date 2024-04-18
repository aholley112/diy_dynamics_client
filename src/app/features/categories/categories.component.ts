import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];


  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Method to load categories
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

  // Method to navigate to the category-projects page when a category is selected
  selectCategory(categoryId: string): void {
    this.router.navigate(['/category-projects', categoryId]);
  }
}
