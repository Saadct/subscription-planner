import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SubscriptionCalendarComponent } from "./features/subscriptions/components/subscriptions/subscription.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SubscriptionCalendarComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <router-outlet>
        <app-subscription-calendar></app-subscription-calendar>
      </router-outlet>
    </main>
  `,
  styles: []
})
export class App {
  title = '';
}