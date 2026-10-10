import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import type { NewUser } from '../models/new-user';
import type { RegisterResponse } from '../models/register-response';
import type { LoginRequest } from '../models/login-request';
import type { LoginResponse } from '../models/login-response';
import type { LogoutResponse } from '../models/logout-response';

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

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      loginRequest,
      {
        withCredentials: true,
      }
    ).pipe(
      tap({
        next: () => {
          this.loggedIn = true;
        },
        error: () => {
          this.loggedIn = false;
        },
      })
    );
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true,
      }
    ).pipe(
      tap(() => {
        this.loggedIn = false;
      })
    );
  }

  checkSession(): Observable<boolean> {
    return this.http.get<LoginResponse>(
      `${this.apiUrl}/me`,
      { withCredentials: true }
    ).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((authenticated) => {
        this.loggedIn = authenticated;
      })
    );
  }

  restoreLoginState(): void {
    this.checkSession().subscribe();
  }
}
