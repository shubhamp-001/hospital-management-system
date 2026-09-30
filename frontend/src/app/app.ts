import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('hospital-frontend');

  isLoggedIn;
  currentUrl;

  constructor(private authService: Auth, private router: Router) {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.currentUrl = signal(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects);
      });
  }

  get showShell(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return this.isLoggedIn() && !hiddenRoutes.includes(this.currentUrl());
  }
}