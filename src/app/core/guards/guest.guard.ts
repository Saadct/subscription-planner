import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);

    if (localStorage.getItem('currentUserId')) {
        return router.parseUrl('/subscriptions');
    }
    return true;
};
