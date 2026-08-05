import { Component } from '@angular/core';
import { AuthForm } from '../../components/auth-form/auth-form';
import { FormsModule } from '@angular/forms';
import type { NewUser } from '../../models/new-user';
import { Authentication } from '../../services/authentication';

@Component({
  selector: 'app-signup',
  imports: [AuthForm, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  constructor(private authentication: Authentication){}

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  signUpMessage = '';

  onSubmit(): void {
    const newUser: NewUser = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authentication.register(newUser).subscribe({
      next: (response) => {
        this.signUpMessage = response.message;
      },
      error: () => {
        this.signUpMessage = 'Something went wrong, please try again.';
      },
    });
  }
}
