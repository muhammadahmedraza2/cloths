import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMsg = '';
  submitting = false;

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  goRegister(): void { this.router.navigate(['/register']); }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg = 'Please enter both username and password.';
      return;
    }

    this.errorMsg = '';
    this.submitting = true;
    const { username, password } = this.form.getRawValue();

    this.auth.login(username, password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/app/dashboard']);
      },
      error: (err) => {
        this.submitting = false;
        this.errorMsg = err.status === 401
          ? 'Invalid username or password.'
          : 'Something went wrong. Please check your connection and try again.';
      },
    });
  }
}
