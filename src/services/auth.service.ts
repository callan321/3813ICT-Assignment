import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usernameKey = 'username';

  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  clearUsername(): void {
    localStorage.removeItem(this.usernameKey);
  }

  isLoggedIn(): boolean {
    return this.getUsername() !== null;
  }
}
