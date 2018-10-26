import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate {
    isLoggedIn = false;
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.checkLogin();
    }

    checkLogin(): boolean {
        if (!environment.production) {
            return true;
        }

        if (this.authService.isLoggedIn) {
            return true;
        }

        this.router.navigate(['/admin/login']);
        return false;
    }
}
