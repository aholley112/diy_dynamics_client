import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable } from '@angular/core';

interface AdminRouteData {
    requiresAdmin?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthenticationService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot): boolean {
        const data = route.data as AdminRouteData;
        const requiresAdmin = data.requiresAdmin || false;

        if (!this.authService.getToken()) {
            this.router.navigate(['/auth']);
            return false;
        }

        if (requiresAdmin && !this.authService.isAdmin()) {
            this.router.navigate(['/home']); 
            return false;
        }

        return true;
    }
}
