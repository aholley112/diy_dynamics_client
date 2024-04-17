import { Component, OnInit, } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Project } from '../../shared/models/project.model';
import { ProjectService } from '../../core/services/project.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectsComponent } from '../projects/projects.component';
import { CategoriesComponent } from '../categories/categories.component';

import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, ProjectsComponent, CategoriesComponent, AuthComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProjects: Project[] = [];
  showAuthForm: boolean = false;
  authAction: 'sign-up' | 'log-in' = 'log-in';



  constructor(
    private categoryService: CategoryService,
    private projectService: ProjectService,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {

  }

  handleCallToAction(route: string): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([route]);
    } else {

      this.authService.setPendingRoute(route);
      this.showAuthForm = true;
      this.authAction = 'log-in';
    }
  }

  handleLoginSuccess(): void {
    const route = this.authService.getPendingRoute();
    if (route) {
      this.router.navigate([route]);
      this.authService.clearPendingRoute();
    } else {
      this.router.navigate(['/home']); 
    }
  }

  openAuthForm(action: 'sign-up' | 'log-in'): void {
    this.authAction = action;
    this.showAuthForm = true;
  }

  closeAuthForm(): void {
    this.showAuthForm = false;
  }

  navigateToProjects(): void {
    this.handleCallToAction('/projects');

  }
  navigateToCreateProject(): void {
    this.handleCallToAction('/create-project');

  }

  navigateToProfile(): void {
    this.handleCallToAction('/profile');
  }

}


