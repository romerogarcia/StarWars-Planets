/** A registered user as stored in the browser (the password is never stored in clear text). */
export interface StoredUser {
  username: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export interface Session {
  username: string;
  firstName: string;
}

/** Planet as returned by https://swapi.info/api/planets */
export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  url: string;
}

/** Film as returned by https://swapi.info/api/films */
export interface Film {
  title: string;
  episode_id: number;
  url: string;
}
