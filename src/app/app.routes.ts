import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Sign in · Star Wars Planets',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'Registration',
    title: 'Create your account · Star Wars Planets',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/registration/registration').then((m) => m.Registration),
  },
  {
    path: 'Planets',
    title: 'Planets · Star Wars Planets',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/planets/planets').then((m) => m.Planets),
  },
  {
    path: '**',
    title: 'Lost in space · Star Wars Planets',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
