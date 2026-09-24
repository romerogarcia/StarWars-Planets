import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { authGuard, guestGuard } from './auth.guards';
import { AuthService } from './auth.service';

describe('auth guards', () => {
  const run = (guard: typeof authGuard) =>
    TestBed.runInInjectionContext(() => guard({} as never, {} as never));

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('sends visitors to the login and lets signed-in users in', async () => {
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(run(authGuard) as UrlTree)).toBe('/');
    await TestBed.inject(AuthService).login('Luke', 'Skywalker');
    expect(run(authGuard)).toBe(true);
  });

  it('sends signed-in users from login/registration to the planets', async () => {
    expect(run(guestGuard)).toBe(true);
    await TestBed.inject(AuthService).login('Luke', 'Skywalker');
    expect(TestBed.inject(Router).serializeUrl(run(guestGuard) as UrlTree)).toBe('/Planets');
  });
});
