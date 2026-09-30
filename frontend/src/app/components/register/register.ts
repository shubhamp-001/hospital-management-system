import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { LookupService, Role } from '../../services/lookup';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  fullName: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  roleId: number | null = null;
  roles: Role[] = [];
  errorMessage: string = '';

  constructor(
    private authService: Auth,
    private lookupService: LookupService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lookupService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Failed to load roles', err);
      }
    });
  } 
    togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.roleId) {
      this.errorMessage = 'Please select a role.';
      return;
    }

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      roleId: this.roleId
    }).subscribe({
      next: () => {
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}