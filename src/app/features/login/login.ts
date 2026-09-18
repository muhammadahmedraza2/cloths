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

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    const ok = this.auth.login(this.username, this.password);
    if (ok) {
      this.errorMsg = '';
      this.router.navigate(['/app/dashboard']);
    } else {
      this.errorMsg = 'Please enter both username and password.';
    }
  }
}
