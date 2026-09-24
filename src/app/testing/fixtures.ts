import { Film, Planet } from '../core/models';

const planet = (
  name: string,
  id: number,
  films: number[],
  extra: Partial<Planet> = {},
): Planet => ({
  name,
  rotation_period: '24',
  orbital_period: '365',
  diameter: '10000',
  climate: 'temperate',
  gravity: '1 standard',
  terrain: 'grasslands',
  surface_water: '10',
  population: '1000',
  residents: [],
  films: films.map((f) => `https://swapi.info/api/films/${f}`),
  url: `https://swapi.info/api/planets/${id}`,
  ...extra,
});

/** 12 planets (+ the "unknown" placeholder SWAPI returns) → 2 pages of 10. */
export const PLANETS: Planet[] = [
  planet('Tatooine', 1, [1, 3], {
    population: '200000',
    diameter: '10465',
    terrain: 'desert',
    climate: 'arid',
  }),
  planet('Alderaan', 2, [1]),
  planet('Yavin IV', 3, [1]),
  planet('Hoth', 4, [2], {
    population: 'unknown',
    terrain: 'tundra, ice caves',
    climate: 'frozen',
  }),
  planet('Dagobah', 5, [2, 3], {
    population: 'unknown',
    terrain: 'swamp, jungles',
    climate: 'murky',
  }),
  planet('Bespin', 6, [2]),
  planet('Endor', 7, [3]),
  planet('Naboo', 8, [3]),
  planet('Coruscant', 9, [3]),
  planet('Kamino', 10, [2]),
  planet('Geonosis', 11, [2]),
  planet('Utapau', 12, [3]),
  planet('unknown', 28, [], { diameter: '0', population: 'unknown' }),
];

export const FILMS: Film[] = [
  { title: 'A New Hope', episode_id: 4, url: 'https://swapi.info/api/films/1' },
  { title: 'The Empire Strikes Back', episode_id: 5, url: 'https://swapi.info/api/films/2' },
  { title: 'Return of the Jedi', episode_id: 6, url: 'https://swapi.info/api/films/3' },
];
