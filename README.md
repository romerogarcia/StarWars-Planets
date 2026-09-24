# Star Wars Planets

Web app to explore the planets of the Star Wars saga. Sign in (or create an account) and search the planets by name, see their population, diameter, terrain, climate and the films they appear in.

**Live demo:** https://romerogarcia.github.io/StarWars-Planets/

## Tech stack

- [Angular 22](https://angular.dev): standalone components, signals, `httpResource`, the new control flow and lazy-loaded routes
- Reactive Forms with validation
- SCSS
- Data from [SWAPI](https://swapi.info) (the Star Wars API)
- Vitest for unit tests

## Features

- **Sign in** with username and password. Clear errors for unknown users and wrong passwords.
- **Create your account**: validated form (username without spaces, password of at least 6 characters, first and last name). Usernames can't be repeated, and new users can sign in again later.
- **Protected routes**: `/Planets` is only available when you are signed in; signed-in users skip the login and registration screens. Your session is kept when you reload the page, and you can log out.
- **Planets**: all the planets sorted alphabetically, 6 per page, with instant search by name. Film titles are shown instead of API links.
- Loading and error states (with a retry button) when the API is slow or down.
- 404 page for unknown URLs.

Demo accounts: `Luke / Skywalker`, `Leia / Skywalker`, `Obi-Wan / Kenobi`.

> This is a front-end demo with no backend: users are stored in the browser (localStorage) and passwords are saved as SHA-256 hashes, never in clear text. A real app must authenticate against a server.

## Getting started

Requirements: Node.js `^22.22.3`, `^24.15.0` or `>=26`.

```bash
npm install
npm start      # http://localhost:4200
npm test       # unit tests
npm run build  # production build in docs/ (served by GitHub Pages)
```

## Project structure

```
src/
├── app/
│   ├── core/        # auth service + guards, planets service, models
│   ├── pages/       # login, registration, planets, not-found
│   └── shared/      # success alert
├── images/          # background images used from SCSS
├── styles/          # SCSS partials (variables, one file per page)
└── styles.scss
public/images/       # images used in the templates
```

## Deployment

GitHub Pages serves the `docs/` folder of the `main` branch. After changing the code, run `npm run build` and commit the updated `docs/` folder.
