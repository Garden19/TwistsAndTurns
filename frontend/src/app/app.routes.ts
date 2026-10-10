import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { map } from 'rxjs';
import { Authentication } from './features/authentication/services/authentication';
import { Login } from './features/authentication/pages/login/login';
import { Signup } from './features/authentication/pages/signup/signup';
import { FinanceDashboard } from './features/finance/pages/finance-dashboard/finance-dashboard';

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "signup", component: Signup },
    {
        path: "finance",
        component: FinanceDashboard,
        canActivate: [() => {
            const authentication = inject(Authentication);
            const router = inject(Router);
            return authentication.checkSession().pipe(
                map((authenticated) =>
                    authenticated ? true : router.createUrlTree(['/login'])
                )
            );
        }]
    },
    { path: "", redirectTo: "finance", pathMatch: "full" },
    { path: "**", redirectTo: "finance" }
];
