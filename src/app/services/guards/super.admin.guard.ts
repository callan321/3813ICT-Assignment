import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isSuperAdmin()) {
      return true;
    } else {
      this.router.navigate(['/home']); // Redirect to unauthorized page or login
      return false;
    }
  }
}
