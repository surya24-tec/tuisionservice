import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from '../models/menu-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule, MatTooltipModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() collapsed: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
