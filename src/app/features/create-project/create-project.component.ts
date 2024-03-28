import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../core/services/category.service';
import { Project } from '../../shared/models/project.model';
import { AuthenticationService } from '../../core/services/authentication.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NavigationBarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, NavigationBarComponent, RouterModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  project: Omit<Project, 'id' | 'userId' | 'isFavoriteProject' | 'image_url' | 'material_names' | 'tool_names'> = {
    title: '',
    description: '',
    instructions: '',
    est_time_to_completion: '',
  };

  categoryId?: number | string;
  selectedFile: File | null = null;
  materialNames: string = '';
  toolNames: string = '';
  categories: Category[] = [];


  constructor(private projectService: ProjectService, private categoryService: CategoryService, private authenticationService: AuthenticationService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error fetching categories', error);
      }
    );
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  submitProject(): void {
    console.log('Category ID:', this.categoryId);
    const userId = this.authenticationService.getCurrentUserId();
    if (!userId) {
      console.error('No user ID found, unable to submit the project');
      return;
    }
    const formData = new FormData();
    formData.append('user_id', userId.toString());

    formData.append('title', this.project.title);
    formData.append('description', this.project.description);
    formData.append('instructions', this.project.instructions);
    formData.append('est_time_to_completion', this.project.est_time_to_completion);
    formData.append('material_names', this.materialNames);
    formData.append('tool_names', this.toolNames);
    if (this.categoryId !== undefined) {
      formData.append('category_id', this.categoryId.toString());
  } else {
      console.error('Category ID is undefined');
      return;
  }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.projectService.createProject(formData).subscribe({
      next: (response) => {
        console.log('Project created successfully', response);
        this.router.navigate(['/categories', this.categoryId]);
      },
      error: (error) => {
        console.error('Error creating project', error);

      }
    });
  }
}
