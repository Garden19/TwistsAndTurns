import { Routes } from '@angular/router';
import { Login } from './features/authentication/pages/login/login';
import { Signup } from './features/authentication/pages/signup/signup';
import { FinanceDashboard } from './features/finance/pages/finance-dashboard/finance-dashboard';

export const routes: Routes = [
    { path: "login", component: Login },
    { path: "signup", component: Signup },
    { path: "finance", component: FinanceDashboard }
];
