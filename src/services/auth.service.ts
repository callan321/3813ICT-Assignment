import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIdKey = 'userId';
  private usernameKey = 'username';
  private rolesKey = 'roles'; // Add a key to store roles

  // Store username, userId, and roles
  saveUserSessionData(username: string, userId: number, roles: string[]): void {
    localStorage.setItem(this.usernameKey, username);
    localStorage.setItem(this.userIdKey, userId.toString());
    localStorage.setItem(this.rolesKey, JSON.stringify(roles)); // Store roles as a stringified array
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
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

  hasRole(role: string): boolean {
    const roles = this.getUserRoles();
    return roles.includes(role);
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  isGroupAdmin(): boolean {
    return this.hasRole('group_admin');
  }
}
