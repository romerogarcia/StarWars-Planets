import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { successAlert } from '../../shared/alert';

export const MIN_PASSWORD_LENGTH = 6;

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly minPassword = MIN_PASSWORD_LENGTH;
  protected readonly form = inject(NonNullableFormBuilder).group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^\S+$/)]],
    password: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  protected readonly usernameTaken = signal<string | null>(null);
  protected readonly submitting = signal(false);

  constructor() {
    this.form.controls.username.valueChanges.subscribe(() => this.usernameTaken.set(null));
  }

  protected showError(control: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[control];
    return c.invalid && c.touched;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const result = await this.auth.register(this.form.getRawValue());
    this.submitting.set(false);

    if (!result.ok) {
      this.usernameTaken.set(result.message);
      return;
    }
    successAlert('Confirming registration');
    await this.router.navigate(['/Planets']);
  }
}
