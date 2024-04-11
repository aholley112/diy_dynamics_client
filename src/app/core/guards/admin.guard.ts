import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authenticationService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authenticationService.isAdmin()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
