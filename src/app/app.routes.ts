import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/subscriptions',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'subscriptions',
    canActivate: [authGuard], // Protection par authentification
    loadChildren: () => import('./features/subscriptions/subscriptions.routes').then(m => m.SUBSCRIPTION_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard], // Protection admin
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];