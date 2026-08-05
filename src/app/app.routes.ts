import { Routes } from '@angular/router';
import { Login } from './features/authentication/pages/login/login';
import { Signup } from './features/authentication/pages/signup/signup';

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "signup", component: Signup }
];
