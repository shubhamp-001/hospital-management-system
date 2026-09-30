import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  showPassword: boolean = false;
  rememberMe: boolean = false;

  emailTouched: boolean = false;
  passwordTouched: boolean = false;

  isLoading: boolean = false;

  errorMessage = signal('');

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }


  onSubmit(): void {

    this.emailTouched = true;
    this.passwordTouched = true;

    this.errorMessage.set('');

    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage.set(
        'Please enter your email and password.'
      );

      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set(
        'Password must be at least 6 characters.'
      );

      return;
    }

    this.isLoading = true;


    // Existing backend login
    this.authService.login(
      this.email,
      this.password
    ).subscribe({

      next: (response) => {

        console.log(
          'Login successful',
          response
        );

        this.isLoading = false;

        this.router.navigate([
          '/dashboard'
        ]);

      },

      error: (err) => {

        console.error(
          'Login failed',
          err
        );

        this.isLoading = false;

        this.errorMessage.set(
          'Invalid email or password.'
        );

      }

    });

  }


  forgotPassword(event: Event): void {

    event.preventDefault();

    alert(
      'Forgot password functionality will be connected later.'
    );

  }

}