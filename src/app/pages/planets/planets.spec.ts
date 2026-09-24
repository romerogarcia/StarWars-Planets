import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SWAPI_URL } from '../../core/planets.service';
import { FILMS, PLANETS } from '../../testing/fixtures';
import { Planets, paginationItems } from './planets';

describe('Planets', () => {
  let fixture: ComponentFixture<Planets>;
  let el: HTMLElement;
  let http: HttpTestingController;

  const names = () => [...el.querySelectorAll('article h2')].map((h) => h.textContent?.trim());
  const button = (label: string) =>
    el.querySelector<HTMLButtonElement>(`nav button[aria-label="${label}"]`)!;
  const pageNumbers = () =>
    [...el.querySelectorAll('.pagination__pages li')].map((li) => li.textContent?.trim());

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Planets);
    el = fixture.nativeElement;
    fixture.detectChanges();
    TestBed.tick();
    http.expectOne(`${SWAPI_URL}/planets`).flush(PLANETS);
    http.expectOne(`${SWAPI_URL}/films`).flush(FILMS);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('shows the first 6 planets in alphabetical order, without "unknown"', () => {
    expect(names().length).toBe(6);
    expect(names()[0]).toBe('Alderaan');
    expect(names()).not.toContain('unknown');
    expect(el.textContent).toContain('Showing 1–6 of 12 planets');
  });

  it('paginates with page numbers and the previous/next arrows', () => {
    expect(pageNumbers()).toEqual(['1', '2']);
    expect(button('Page 1').getAttribute('aria-current')).toBe('page');
    expect(button('Previous page').disabled).toBe(true);

    button('Page 2').click();
    fixture.detectChanges();
    expect(names()).toEqual(['Hoth', 'Kamino', 'Naboo', 'Tatooine', 'Utapau', 'Yavin IV']);
    expect(button('Page 2').getAttribute('aria-current')).toBe('page');
    expect(button('Next page').disabled).toBe(true);

    button('Previous page').click();
    fixture.detectChanges();
    expect(names()[0]).toBe('Alderaan');
  });

  it('hides the pagination when everything fits in one page', () => {
    const input = el.querySelector<HTMLInputElement>('#planet-search')!;
    input.value = 'oo';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(el.querySelector('.pagination')).toBeNull();
  });

  it('searches by name and goes back to the first page', () => {
    button('Page 2').click();
    fixture.detectChanges();
    const input = el.querySelector<HTMLInputElement>('#planet-search')!;
    input.value = 'tat';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(names()).toEqual(['Tatooine']);
    expect(el.textContent).toContain('Showing 1–1 of 1 planets');
  });

  it('shows a message when nothing matches', () => {
    const input = el.querySelector<HTMLInputElement>('#planet-search')!;
    input.value = 'Death Star';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(names().length).toBe(0);
    expect(el.textContent).toContain('No planets match "Death Star"');
  });

  it('shows the film titles instead of API links', () => {
    const input = el.querySelector<HTMLInputElement>('#planet-search')!;
    input.value = 'Tatooine';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const tatooine = [...el.querySelectorAll('article')].find((a) =>
      a.textContent?.includes('Tatooine'),
    )!;
    expect(tatooine.textContent).toContain('A New Hope');
    expect(tatooine.textContent).toContain('Return of the Jedi');
    expect(tatooine.textContent).toContain('200,000');
  });
});

describe('paginationItems', () => {
  it('lists every page when there are few', () => {
    expect(paginationItems(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('collapses the middle pages with gaps', () => {
    expect(paginationItems(1, 12)).toEqual([1, 2, '…', 12]);
    expect(paginationItems(6, 12)).toEqual([1, '…', 5, 6, 7, '…', 12]);
    expect(paginationItems(12, 12)).toEqual([1, '…', 11, 12]);
  });
});
