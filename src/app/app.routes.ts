import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path: '',
    redirectTo: '/subscriptions',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'subscriptions',
    loadChildren: () => import('./features/subscriptions/subscriptions.routes').then(m => m.SUBSCRIPTION_ROUTES),
  },
  //   {
  //     path: 'admin',
  //     loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  //   },
];