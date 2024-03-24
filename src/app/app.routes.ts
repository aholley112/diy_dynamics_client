import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    canActivate: [NoAuthGuard]
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
  },


  {
    path: 'categories',
    loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
  },

    {
      path: 'profile',
      loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
    },

    {
      path: 'category-projects/:category_id',
      loadComponent: () => import('./category-projects/category-projects.component').then(m => m.CategoryProjectsComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'projects',
      loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'project-detail/:id',
      loadComponent: () => import('./project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'create-project',
      loadComponent: () => import('./create-project/create-project.component').then(m => m.CreateProjectComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'edit-project/:id',
      loadComponent: () => import('./edit-project/edit-project.component').then(m => m.EditProjectComponent),
      canActivate: [AuthGuard]
    },

    {
      path: 'admin',
      loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
      canActivate: [AuthGuard],
      data: { requiresAdmin: true }
    },


 { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'home' }


];
