import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Planet } from '../../core/models';
import { PlanetsService } from '../../core/planets.service';

export const PAGE_SIZE = 6;

@Component({
  selector: 'app-planets',
  imports: [DecimalPipe],
  templateUrl: './planets.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Planets {
  protected readonly auth = inject(AuthService);
  protected readonly data = inject(PlanetsService);
  private readonly router = inject(Router);

  protected readonly search = signal('');
  protected readonly page = signal(1);

  /** Planets whose name contains the search text, sorted alphabetically. */
  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.data.planets
      .value()
      .filter((p) => p.name !== 'unknown' && p.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)),
  );

  protected readonly visible = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  protected readonly rangeLabel = computed(() => {
    const total = this.filtered().length;
    if (!total) return '';
    const start = (this.page() - 1) * PAGE_SIZE + 1;
    const end = Math.min(start + PAGE_SIZE - 1, total);
    return `Showing ${start}–${end} of ${total} planets`;
  });

  protected readonly pageItems = computed(() => paginationItems(this.page(), this.totalPages()));

  protected goTo(page: number): void {
    const target = Math.min(Math.max(1, page), this.totalPages());
    if (target === this.page()) return;
    this.page.set(target);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document
      .getElementById('planets-results')
      ?.scrollIntoView?.({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1); 
  }

  protected films(planet: Planet): string[] {
    return this.data.filmTitlesFor(planet);
  }


  protected isNumber(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value);
  }

  protected async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(['/']);
  }
}

export function paginationItems(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | '…')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('…');
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 1) items.push('…');
  items.push(total);
  return items;
}
