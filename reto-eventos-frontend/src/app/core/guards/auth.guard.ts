import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (_, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginUrlTree = router.createUrlTree(['/login'], {
    queryParams: { redirectTo: state.url },
  });

  if (authService.isAuthenticated()) {
    return true;
  }

  const sessionRequest = authService.loadSession();

  if (!sessionRequest) {
    return loginUrlTree;
  }

  return sessionRequest.pipe(
    map(() => true),
    catchError(() => of(loginUrlTree)),
  );
};
