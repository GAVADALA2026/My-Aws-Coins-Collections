import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, of } from 'rxjs';
import { authGuard } from './auth.guard';

type GuardResult = boolean | UrlTree;

describe('authGuard', () => {
  const executeGuard = async (user: { username: string; pwd: string }) => {
    const store = { select: jest.fn(() => of(user)) };
    const urlTree = { redirectedTo: '/' } as unknown as UrlTree;
    const router = { createUrlTree: jest.fn(() => urlTree) };
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }, { provide: Router, useValue: router }],
    });

    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
      ) as Observable<GuardResult>,
    );
    return { result, store, router, urlTree };
  };

  it('allows navigation when both credentials contain non-whitespace characters', async () => {
    const { result, router } = await executeGuard({ username: 'gabriele', pwd: 'password' });
    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it.each([
    { username: '', pwd: 'password' },
    { username: 'gabriele', pwd: '' },
    { username: '   ', pwd: '\t' },
  ])('redirects unauthenticated credentials %# to the login route', async (user) => {
    const { result, store, router, urlTree } = await executeGuard(user);
    expect(result).toBe(urlTree);
    expect(store.select).toHaveBeenCalledTimes(1);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/']);
  });
});
