import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [NoAuthGuard]
  },

  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  },


  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent),
  },

    {
      path: 'profile',
      loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    },

    {
      path: 'category-projects/:category_id',
      loadComponent: () => import('./features/category-projects/category-projects.component').then(m => m.CategoryProjectsComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'projects',
      loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'project-detail/:id',
      loadComponent: () => import('./features/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'create-project',
      loadComponent: () => import('./features/create-project/create-project.component').then(m => m.CreateProjectComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'edit-project/:id',
      loadComponent: () => import('./features/edit-project/edit-project.component').then(m => m.EditProjectComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'admin',
      loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
      canActivate: [AuthGuard],
      data: { requiresAdmin: true }
    },


 { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'home' }


];
