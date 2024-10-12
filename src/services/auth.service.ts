import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIdKey = 'userId';
  private usernameKey = 'username';
  private rolesKey = 'roles';

  constructor(private router: Router) {}

  // Store username, userId (as string), and roles
  saveUserSessionData(username: string, userId: string, roles: string[]): void {
    localStorage.setItem(this.usernameKey, username);
    localStorage.setItem(this.userIdKey, userId);
    localStorage.setItem(this.rolesKey, JSON.stringify(roles));
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  getUserRoles(): string[] {
    const roles = localStorage.getItem(this.rolesKey);
    return roles ? JSON.parse(roles) : [];
  }

  clearAuthData(): void {
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.rolesKey);
  }

  isLoggedIn(): boolean {
    return this.getUsername() !== null;
  }
  Logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

}
