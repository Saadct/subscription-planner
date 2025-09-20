import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await authService.getCurrentUser(); // async
    if (user) {
        return true; // ✅ Utilisateur connecté
    } else {
        console.log('User from authguard:', user);

        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false; // 🔄 Redirection si non connecté
    }
};
