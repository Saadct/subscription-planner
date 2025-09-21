import { Routes } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: UserListComponent,
    },
    {
        path: 'category',
        component: CategoryListComponent,
    },
    {
        path: 'dashboard',
        component: DashboardAdminComponent,
    },
];
