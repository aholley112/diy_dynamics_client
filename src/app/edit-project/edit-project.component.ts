import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../core/services/project.service';

@Component({
  selector: 'app-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.scss'
})

export class EditProjectComponent implements OnInit {
  editForm: FormGroup;
  projectId!: number;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['id'];
      this.projectService.getProjectById(this.projectId).subscribe({
        next: (project) => {
          this.editForm.patchValue(project); 
        },
        error: (error) => console.error('Error fetching project', error)
      });
    });
  }


  saveChanges(): void {
    this.projectService.updateProject(this.projectId, this.editForm.value).subscribe({
      next: () => this.router.navigate(['/project-detail', this.projectId]),
      error: (error) => console.error('There was an error!', error)
    });
  }
}

