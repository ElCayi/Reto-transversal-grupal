import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const homeUrlTree = router.createUrlTree(['/']);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }

  const sessionRequest = authService.loadSession();

  if (!sessionRequest) {
    return homeUrlTree;
  }

  return sessionRequest.pipe(
    map(() => authService.isAdmin() ? true : homeUrlTree),
    catchError(() => of(homeUrlTree)),
  );
};
