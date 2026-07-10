import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, MatDividerModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() userName: string = 'User';
  @Input() userRole: string = 'Role';
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
