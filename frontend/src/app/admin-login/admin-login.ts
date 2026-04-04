import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './admin-service/auth-service';

@Component({
  selector: 'app-admin-login',
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  constructor(private router: Router, private authService: AuthService) {}
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  
  hidePassword = true;
  error = '';

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (response: { accessToken: string; refreshToken: string }) => {
          this.authService.saveTokens(response.accessToken, response.refreshToken);
          this.error = '';
          this.router.navigate(['admin/dashboard']);
        },
        error: () => {
          this.error = 'Identifiants incorrects';
        }
      });
    }
  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }
}
