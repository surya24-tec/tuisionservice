import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TimetableEvent } from '../../models/timetable.model';
import { TimetableService } from '../../../services/timetable.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-timetable-widget',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableWidgetComponent implements OnInit {
  @Input() userId: number = 0;
  @Input() role: string = 'STUDENT';
  
  schedule: TimetableEvent[] = [];

  constructor(private timetableService: TimetableService) {}

  ngOnInit(): void {
    this.timetableService.getTodaySchedule(this.userId, this.role).subscribe((data: TimetableEvent[]) => {
      this.schedule = data;
    });
  }
}
