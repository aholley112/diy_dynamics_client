import { Routes } from '@angular/router';
/*import { noAuthGuard } from './no-auth.guard';*/

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((c) => c.LoginComponent)
    /*canActivate: [noAuthGuard]*/
  },

  { path: '**', redirectTo: 'login' }

];
