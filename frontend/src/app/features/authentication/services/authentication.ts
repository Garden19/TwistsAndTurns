import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { NewUser } from '../models/new-user';
import type { RegisterResponse } from '../models/register-response';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  constructor(private http: HttpClient){}
  private apiUrl = 'http://localhost:5200/api/authentication';
  private loggedIn = false;

  register(newUser: NewUser): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      newUser
    );
  }

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
