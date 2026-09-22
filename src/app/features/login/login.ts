import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  username = '';
  password = '';
  errorMsg = '';
  submitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMsg = 'Please enter both username and password.';
      return;
    }

    this.errorMsg = '';
    this.submitting = true;

    this.auth.login(this.username, this.password).subscribe({
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