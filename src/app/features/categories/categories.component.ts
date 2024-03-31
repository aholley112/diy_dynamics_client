import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../shared/models/category.model';
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
  // The list of categories to be displayed
  categories: Category[] = [];
  showCreateProjectForm: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  // Fetch the categories when the component is initialized
  ngOnInit(): void {
    this.loadCategories();
  }

  // Fetch the categories from the API
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
  // Navigate to the projects page when a category is selected
  selectCategory(categoryId: string): void {
    this.router.navigate(['/category-projects', categoryId]);
  }
  openCreateProjectForm() {
    this.router.navigate(['/create-project']);
    this.showCreateProjectForm = true;
  }

  closeCreateProjectForm() {
    this.showCreateProjectForm = false;
  }

}
