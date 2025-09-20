import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await authService.getCurrentUser(); // async

    if (user && user.role === 'admin') {
        return true; // ✅ Accès admin autorisé
    } else {
        console.log('User from adminGuard:', user);

        console.log("crash")
        router.navigate(['/subscriptions']); // 🔄 Redirection si pas admin
        return false;
    }
};
