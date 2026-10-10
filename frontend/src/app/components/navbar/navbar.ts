import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Authentication } from '../../features/authentication/services/authentication';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(private authentication: Authentication, private router: Router) {}
  
  isLoggedIn(): Boolean {
    return this.authentication.isLoggedIn();
  }

  logOut(): void {
    this.authentication.logout().subscribe({
      next: () => {
        void this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: () => {
        console.error('Logout failed');
      },
    });
  }
}