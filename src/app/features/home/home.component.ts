import { Component, OnInit, } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsComponent } from '../projects/projects.component';
import { CategoriesComponent } from '../categories/categories.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProjectsComponent, CategoriesComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProjects: Project[] = [];


  constructor(
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {

  }
  navigateToProjects(): void {
    this.router.navigateByUrl('/projects');
  }


}


