import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await authService.getCurrentUser();

    if (user && user.role === 'admin') {
        return true;
    } else if (user) {
        router.navigate(['/subscriptions']);
        return false;
    } else {
        router.navigate(['/auth/login']);
        return false;
    }
};
