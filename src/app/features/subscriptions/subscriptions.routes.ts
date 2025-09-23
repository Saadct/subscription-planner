import { Routes } from '@angular/router';
import { SubscriptionCalendarComponent } from './components/subscriptions/subscription.component';
import { DashboardUserComponent } from './components/dashboard-user/dashboard-user.component';

export const SUBSCRIPTION_ROUTES: Routes = [
    { path: '', component: SubscriptionCalendarComponent },
    { path: 'dashboard', component: DashboardUserComponent },
];
