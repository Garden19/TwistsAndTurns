import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Authentication } from '../../features/authentication/services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private authentication: Authentication) {}
  
  isLoggedIn(): Boolean {
    return this.authentication.isLoggedIn();
  }

  logOut(): void {
    this.authentication.logout().subscribe({
      error: () => {
        console.error('Logout failed');
      },
    });
  }
}