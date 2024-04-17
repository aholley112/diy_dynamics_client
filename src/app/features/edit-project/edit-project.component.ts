import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../core/services/category.service';



@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterModule],
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

    // Initialize the form
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      instructions: [''],
      est_time_to_completion: [''],
      material_names: [''],
      tool_names: [''],
      category: [''],
      image: ['']
    });

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.loadCategories();
      this.loadProjectData();
    });
  }

  // Method to load categories for the dropdown list in the edit form.
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

  // Method to load project data into the form.
  loadProjectData(): void {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: project => {
        console.log("Received project data:", project);
        this.editForm.patchValue({
          title: project.title,
          description: project.description,
          instructions: project.instructions,
          est_time_to_completion: project.est_time_to_completion,
          material_names: project.material_names || '',
          tool_names: project.tool_names || '',
          image: project.image_url,
          category: project.categories && project.categories.length > 0 ? project.categories[0].id : null
        });

        if (project.categories && project.categories.length > 0) {
          this.editForm.patchValue({
            category: project.categories[0].id
          });
        }
      },
      error: error => console.error('Error fetching project', error)
    });
  }

  // Method to handle file selection
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length) {
      this.selectedFile = target.files[0];
    }
  }

  // Method to handle form submission
  saveChanges(): void {
    console.log('Form validity:', this.editForm.valid);

    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('title', this.editForm.value.title);
      formData.append('description', this.editForm.value.description);
      formData.append('instructions', this.editForm.value.instructions);
      formData.append('est_time_to_completion', this.editForm.value.est_time_to_completion);
      formData.append('material_names', this.editForm.value.material_names);
      formData.append('tool_names', this.editForm.value.tool_names);

      if (this.selectedFile) {
          formData.append('image', this.selectedFile);
      }


      if (this.editForm.value.category) {
          formData.append('category_id', this.editForm.value.category);
      }

      // Call the updateProject method from the project service
      this.projectService.updateProject(this.projectId, formData).subscribe({
        next: (response) => {
          console.log('Project updated successfully:', response);
          this.router.navigate(['/project-detail', this.projectId]);
        },
        error: (error) => {
          console.error('There was an error updating the project:', error);
        }
      });
    } else {
      console.error('Form is not valid:', this.editForm.errors);
    }
  }
}
