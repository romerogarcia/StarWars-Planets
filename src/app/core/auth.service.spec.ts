import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    auth = TestBed.inject(AuthService);
  });

  it('logs in a demo user', async () => {
    expect(await auth.login('Luke', 'Skywalker')).toEqual({ ok: true });
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.currentUser()?.firstName).toBe('Luke');
  });

  it('ignores case and spaces in the username', async () => {
    expect((await auth.login('  obi-wan ', 'Kenobi')).ok).toBe(true);
  });

  it('rejects an unknown user and a wrong password', async () => {
    expect(await auth.login('Vader', 'x')).toMatchObject({ ok: false, field: 'username' });
    expect(await auth.login('Luke', 'wrong')).toMatchObject({ ok: false, field: 'password' });
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('never stores passwords in clear text', async () => {
    await auth.register({
      username: 'Rey',
      password: 'secret123',
      firstName: 'Rey',
      lastName: 'Skywalker',
    });
    expect(localStorage.getItem('sw-planets.users')).not.toContain('secret123');
  });

  it('registers a new user who can log in again later', async () => {
    const result = await auth.register({
      username: 'Rey',
      password: 'secret123',
      firstName: 'Rey',
      lastName: 'Skywalker',
    });
    expect(result.ok).toBe(true);
    expect(auth.currentUser()?.username).toBe('Rey');

    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
    expect((await auth.login('Rey', 'secret123')).ok).toBe(true);
  });

  it('does not allow duplicated usernames', async () => {
    const result = await auth.register({
      username: 'leia',
      password: 'secret123',
      firstName: 'L',
      lastName: 'O',
    });
    expect(result).toMatchObject({
      ok: false,
      field: 'username',
      message: 'This user already exists',
    });
  });
});
