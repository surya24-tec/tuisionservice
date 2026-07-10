import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRoles: string[] = route.data['roles'];
    const user = this.authService.getUser();
    const userRoles = user && user.roles ? user.roles : [];
    const hasRole = expectedRoles.some(r => userRoles.includes(r));
    if (hasRole) {
      return true;
    }
    // Not authorized, redirect to home
    return this.router.createUrlTree(['/']);
  }
}
