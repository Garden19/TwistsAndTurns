import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private loggedIn = false;

  login(email: string, password: string): boolean {
    if (email === 'admin@hotmail.com' && password === '12345678') {
      this.loggedIn = true;
      return true;
    } else {
      this.loggedIn = false;
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
