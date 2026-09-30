import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { Auth } from '../../services/auth';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  isLoggedIn;
  fullName;
  role;

  currentUrl;

  constructor(private authService: Auth, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.fullName = this.authService.fullName;
    this.role = this.authService.role;

    this.currentUrl = toSignal(
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ),
      { initialValue: null }
    );
  }

  get showNavbar(): boolean {
    const url = this.router.url;
    const hiddenRoutes = ['/login', '/register'];
    return this.isLoggedIn() && !hiddenRoutes.includes(url);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}