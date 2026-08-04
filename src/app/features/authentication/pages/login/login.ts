import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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
    this.loginSuccessful = this.authentication.login(this.email, this.password);
      if(this.loginSuccessful) {
        this.loginMessage = 'Login successful';
      } else {
        this.loginMessage = 'Incorrect email or password';
      }
  }
}