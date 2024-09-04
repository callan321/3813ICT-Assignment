import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userIdKey = 'userId';
  private usernameKey = 'username';

  setUsernameAndId(username: string, userId: number): void {
    localStorage.setItem(this.usernameKey, username);
    localStorage.setItem(this.userIdKey, userId.toString());
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.userIdKey);
  }

  isLoggedIn(): boolean {
    return this.getUsername() !== null;
  }
}
