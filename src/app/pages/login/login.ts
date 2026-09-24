import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { successAlert } from '../../shared/alert';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  /** Error returned by the last login attempt, shown under the matching field. */
  protected readonly error = signal<{ field: 'username' | 'password'; message: string } | null>(
    null,
  );
  protected readonly submitting = signal(false);

  constructor() {
    // Clear the server-side style error as soon as the user edits the form again.
    this.form.valueChanges.subscribe(() => this.error.set(null));
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const { username, password } = this.form.getRawValue();
    const result = await this.auth.login(username, password);
    this.submitting.set(false);

    if (!result.ok) {
      this.error.set(result);
      return;
    }
    successAlert('Welcome, registered user!');
    await this.router.navigate(['/Planets']);
  }
}
