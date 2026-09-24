import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="wrapper">
      <div class="text_group">
        <h1 class="text_404">404</h1>
        <p class="text_lost">
          The page you are looking for <br />
          has been lost in space.
        </p>
        <a class="text_home" routerLink="/">Back to Earth</a>
      </div>
      <div class="window_group">
        <div class="window_404">
          <img class="stars" src="images/stars.png" alt="" />
        </div>
      </div>
    </main>
  `,
})
export class NotFound {}
