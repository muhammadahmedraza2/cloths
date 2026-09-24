import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-register', standalone: true, imports: [ReactiveFormsModule], templateUrl: './register.html' })
export class RegisterComponent {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router);
  submitting = false; error = '';
  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', Validators.required], email: ['', [Validators.email]], phoneNumber: [''],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });
  get f() { return this.form.controls; }
  submit() {
    if (this.form.invalid || this.f.password.value !== this.f.confirmPassword.value) { this.form.markAllAsTouched(); this.error = 'Please complete the form and make sure passwords match.'; return; }
    this.error=''; this.submitting=true;
    const { username, fullName, email, phoneNumber, password } = this.form.getRawValue();
    this.auth.register({ username, fullName, email: email || undefined, phoneNumber: phoneNumber || undefined, password }).subscribe({
      next: () => this.auth.login(username, password).subscribe({ next: () => this.router.navigate(['/app/shop']), error: () => this.router.navigate(['/login']) }),
      error: e => { this.submitting=false; this.error=e?.error?.message || 'Registration failed.'; }
    });
  }
  goLogin(){ this.router.navigate(['/login']); }
}
