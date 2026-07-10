import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatCard } from '../../models/dashboard-stats.model';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrls: ['./dashboard-cards.component.css']
})
export class DashboardCardsComponent {
  @Input() cards: StatCard[] = [];
}
