import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../core/services/project.service';
import { Category } from '../shared/models/category.model';
import { CategoryService } from '../core/services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})

export class EditProjectComponent implements OnInit {
  editForm: FormGroup;
  projectId!: number;
  categoryId?: number | string;
  categories: Category[] = [];
  selectedFile: File | null = null;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,

  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      instructions: [''],
      estTime: [''],
      materials: [''],
      tools: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.loadCategories();
      this.loadProjectData();
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      categories => {
        this.categories = categories;
      },
      error => {
        console.error('Error fetching categories', error);
      }
    );
  }

  loadProjectData(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: project => {
        this.editForm.patchValue({
          title: project.title,
          description: project.description,
          instructions: project.instructions,
          estTime: project.est_time_to_completion,
          materials: project.material_names,
          tools: project.tool_names
        });

        if (project.categories && project.categories.length > 0) {
          this.categoryId = project.categories[0].id;  
        }
      },
      error: error => console.error('Error fetching project', error)
    });
  }


  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  saveChanges(): void {
    if (!this.editForm.valid) {
      console.error('Form is not valid');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.editForm.value.title);
    formData.append('description', this.editForm.value.description);
    formData.append('instructions', this.editForm.value.instructions);
    formData.append('est_time_to_completion', this.editForm.value.estTime);
    formData.append('material_names', this.editForm.value.materials);
    formData.append('tool_names', this.editForm.value.tools);

    if (this.categoryId) {
      formData.append('category_id', this.categoryId.toString());
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.projectService.updateProject(this.projectId, formData).subscribe({
      next: () => this.router.navigate(['/project-detail', this.projectId]),
      error: error => console.error('There was an error!', error)
    });
  }
}
