import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { AppState } from '../AppState';

export const authGuard: CanActivateFn = () => {
  const store = inject<Store<AppState>>(Store);
  const router = inject(Router);

  return store.select((state) => state.user).pipe(
    take(1),
    map((user) => {
      const isAuthenticated = user.username.trim() !== '' && user.pwd.trim() !== '';

      return isAuthenticated ? true : router.createUrlTree(['/']);
    }),
  );
};
