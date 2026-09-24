import { Injectable, computed, signal } from '@angular/core';
import { Session, StoredUser } from './models';

const USERS_KEY = 'sw-planets.users';
const SESSION_KEY = 'sw-planets.session';

/** Demo accounts that exist from the start (same ones as the original app). */
const SEED_USERS = [
  { username: 'Luke', password: 'Skywalker', firstName: 'Luke', lastName: 'Skywalker' },
  { username: 'Leia', password: 'Skywalker', firstName: 'Leia', lastName: 'Organa' },
  { username: 'Obi-Wan', password: 'Kenobi', firstName: 'Obi-Wan', lastName: 'Kenobi' },
];

export type AuthResult =
  { ok: true } | { ok: false; field: 'username' | 'password'; message: string };

export interface NewUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Client-side authentication for this demo app.
 *
 * There is no backend, so users live in localStorage. Passwords are stored as SHA-256
 * hashes, never in clear text. This is fine for a portfolio demo, but real apps must
 * authenticate against a server.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly session = signal<Session | null>(read<Session>(SESSION_KEY));

  readonly currentUser = this.session.asReadonly();
  readonly isLoggedIn = computed(() => this.session() !== null);

  async login(username: string, password: string): Promise<AuthResult> {
    const user = (await this.users()).find((u) => sameName(u.username, username));
    if (!user) {
      return { ok: false, field: 'username', message: 'Invalid username' };
    }
    if (user.passwordHash !== (await hash(password))) {
      return { ok: false, field: 'password', message: 'Invalid password' };
    }
    this.startSession(user);
    return { ok: true };
  }

  async register(data: NewUser): Promise<AuthResult> {
    const users = await this.users();
    if (users.some((u) => sameName(u.username, data.username))) {
      return { ok: false, field: 'username', message: 'This user already exists' };
    }
    const user: StoredUser = {
      username: data.username.trim(),
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      passwordHash: await hash(data.password),
    };
    write(USERS_KEY, [...users, user]);
    this.startSession(user);
    return { ok: true };
  }

  logout(): void {
    this.session.set(null);
    remove(SESSION_KEY);
  }

  private startSession(user: StoredUser): void {
    const session: Session = { username: user.username, firstName: user.firstName };
    this.session.set(session);
    write(SESSION_KEY, session);
  }

  /** Registered users, creating the demo accounts the first time. */
  private async users(): Promise<StoredUser[]> {
    const stored = read<StoredUser[]>(USERS_KEY);
    if (stored) return stored;
    const seeded = await Promise.all(
      SEED_USERS.map(async ({ password, ...u }) => ({ ...u, passwordHash: await hash(password) })),
    );
    write(USERS_KEY, seeded);
    return seeded;
  }
}

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

async function hash(text: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (e.g. private mode): the app still works for this visit */
  }
}

function remove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
