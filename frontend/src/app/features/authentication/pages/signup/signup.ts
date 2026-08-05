import { Component } from '@angular/core';
import { AuthForm } from '../../components/auth-form/auth-form';
import { FormsModule } from '@angular/forms';
import type { NewUser } from '../../models/new-user';

@Component({
  selector: 'app-signup',
  imports: [AuthForm, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
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
      password: this.password
    }
    console.log(newUser)
    this.signUpMessage = `Thank you for signing up ${this.firstName}!`
  }
}
