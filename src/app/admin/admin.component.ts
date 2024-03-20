import { Component, OnInit } from '@angular/core';
import { AdminService } from '../core/services/admin.service';
import { Category } from '../shared/models/category.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  categories: Category[] = [];
  newCategory: Category = { id: '0', category_name: '', description: '' };
  editedCategory: Category = { id: '0', category_name: '', description: '' };
  showEditForm = false; 

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  submitCategory(form: any): void {
    if (form.valid) {
      this.adminService.createCategory(this.newCategory).subscribe(
        (data) => {
          this.categories.push(data);
          this.newCategory = { id: '0', category_name: '', description: '' };
        },
        (error) => {
          console.error('Error creating category:', error);
        }
      );
    }
  }


  editCategory(category: Category): void {
    this.editedCategory = { ...category };
    this.showEditForm = true;
  }

  updateCategory(form: any): void {
    if (form.valid) {
      this.adminService.updateCategory(this.editedCategory.id.toString(), this.editedCategory).subscribe(
        (data) => {
          const index = this.categories.findIndex(c => c.id === this.editedCategory.id);
          if (index !== -1) {
            this.categories[index] = data;
          }
          this.cancelEdit();
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );
    }
  }

  deleteCategory(category: Category): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(category.id).subscribe(
        () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
        },
        (error) => {
          console.error('Error deleting category:', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editedCategory = { id: '0', category_name: '', description: '' };
  }

}
