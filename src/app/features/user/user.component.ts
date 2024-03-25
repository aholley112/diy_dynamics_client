import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../core/services/admin.service';
import { Category } from '../../shared/models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  categories: Category[] = []; // Array to store categories

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
}
