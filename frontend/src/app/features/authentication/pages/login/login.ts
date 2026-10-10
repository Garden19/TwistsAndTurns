import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Authentication } from '../../services/authentication';
import { AuthForm } from '../../components/auth-form/auth-form';
import type { LoginRequest } from '../../models/login-request';

@Component({
  selector: 'app-login',
  imports: [FormsModule, AuthForm],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loginMessage = '';
  loginSuccessful = false;

  constructor(private authentication: Authentication){}

  onSubmit(): void {
    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.authentication.login(loginRequest).subscribe({
      next: (response) => {
        this.loginSuccessful = true;
        this.loginMessage = response.message;
      },
      error: (error: HttpErrorResponse) => {
        this.loginSuccessful = false;
        this.loginMessage = error.status === 429
          ? 'Too many unsuccessful attempts. Try again in 15 minutes.'
          : 'Incorrect email or password';
      },
    });
  }
}