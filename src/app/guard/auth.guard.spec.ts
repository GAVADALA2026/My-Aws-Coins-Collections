import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom, Observable, of, Subject } from 'rxjs';
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

  it('uses only the first Store emission and completes the guard observable', () => {
    const users$ = new Subject<{ username: string; pwd: string }>();
    const store = { select: jest.fn(() => users$) };
    const urlTree = { redirectedTo: '/' } as unknown as UrlTree;
    const router = { createUrlTree: jest.fn(() => urlTree) };
    TestBed.configureTestingModule({
      providers: [{ provide: Store, useValue: store }, { provide: Router, useValue: router }],
    });
    const results: GuardResult[] = [];
    let completed = false;
    const guard$ = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    ) as Observable<GuardResult>;

    const subscription = guard$.subscribe({
      next: (result) => results.push(result),
      complete: () => (completed = true),
    });
    users$.next({ username: 'gabriele', pwd: 'password' });
    users$.next({ username: '', pwd: '' });

    expect(results).toEqual([true]);
    expect(completed).toBe(true);
    expect(subscription.closed).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });
});
