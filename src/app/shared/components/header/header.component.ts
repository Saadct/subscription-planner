import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Subscription App</h1>
        <nav>
          <ul class="flex space-x-4">
            @if (auth.loading()) {
              <!-- Rien ou skeleton -->
            } @else {
              @if (auth.currentUser(); as user) {
                @if (user.role !== 'admin') {
                  <li><a routerLink="/subscriptions">Abonnements</a></li>
                  <li><a routerLink="/subscriptions/dashboard">Dashboard</a></li>
                }
                @if (user.role === 'admin') {
                  <li><a routerLink="/admin">User</a></li>
                  <li><a routerLink="/admin/category">Category</a></li>
                  <li><a routerLink="/admin/dashboard">Dashboard</a></li>
                }
                <li><button (click)="logout()">Logout</button></li>
              } @else {
                <li><a routerLink="/auth/login">Login</a></li>
                <li><a routerLink="/auth/register">Register</a></li>
              }
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  async logout() {
    await this.auth.logout();
    setTimeout(() => {
      this.router.navigate(['/auth/login'], { replaceUrl: true });
    }, 0);
  }
}
