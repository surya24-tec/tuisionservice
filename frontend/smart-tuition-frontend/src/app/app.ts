import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showToolbar: boolean = true;

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Hide toolbar on dashboard routes where sidebar takes over
      const url = event.urlAfterRedirects || event.url;
      this.showToolbar = !(
        url === '/' ||
        url.startsWith('/admin') ||
        url.startsWith('/teacher') ||
        url.startsWith('/student')
      );
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
