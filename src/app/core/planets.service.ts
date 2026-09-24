import { httpResource } from '@angular/common/http';
import { Injectable, computed } from '@angular/core';
import { Film, Planet } from './models';

export const SWAPI_URL = 'https://swapi.info/api';

/**
 * Planets and films from SWAPI.
 *
 * swapi.info returns every planet in a single request (60 in total), so searching and
 * pagination are done in the browser: they are instant and don't hit the API again.
 */
@Injectable({ providedIn: 'root' })
export class PlanetsService {
  readonly planets = httpResource<Planet[]>(() => `${SWAPI_URL}/planets`, { defaultValue: [] });
  private readonly films = httpResource<Film[]>(() => `${SWAPI_URL}/films`, { defaultValue: [] });

  /** Film id → title, e.g. "1" → "A New Hope". */
  private readonly filmTitles = computed(
    () => new Map(this.films.value().map((f) => [resourceId(f.url), f.title])),
  );

  filmTitlesFor(planet: Planet): string[] {
    const titles = this.filmTitles();
    return planet.films
      .map((url) => titles.get(resourceId(url)))
      .filter((title): title is string => !!title);
  }

  reload(): void {
    this.planets.reload();
    this.films.reload();
  }
}

/** Last number in a SWAPI url: ".../films/3/" → "3". */
export function resourceId(url: string): string {
  return url.match(/(\d+)\/?$/)?.[1] ?? url;
}
