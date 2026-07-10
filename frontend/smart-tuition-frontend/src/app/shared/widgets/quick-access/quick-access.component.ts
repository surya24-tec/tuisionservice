import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface QuickAction {
  label: string;
  icon: string;
  route: string;
  color?: string;
}

@Component({
  selector: 'app-quick-access-widget',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.css']
})
export class QuickAccessWidgetComponent {
  @Input() title: string = 'Quick Access';
  @Input() actions: QuickAction[] = [];
}
