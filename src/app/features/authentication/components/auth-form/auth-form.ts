import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form',
  imports: [],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {
  @Input ({ required: true }) title = '';
  @Input ({ required: true }) description = '';
}