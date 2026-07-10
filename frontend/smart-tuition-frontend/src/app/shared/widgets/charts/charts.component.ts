import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
// We need to import registerables from chart.js to avoid "category is not a registered scale" error
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-charts-widget',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() title: string = 'Chart';
  @Input() chartType: ChartType = 'bar';
  @Input() chartLabels: string[] = [];
  @Input() chartData: any[] = [];
  
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      y: {
        ticks: { color: 'rgba(255, 255, 255, 0.5)' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  ngOnInit() {
    // Hide scales for pie/doughnut charts
    if (this.chartType === 'pie' || this.chartType === 'doughnut') {
      this.chartOptions = {
        ...this.chartOptions,
        scales: {
          x: { display: false },
          y: { display: false }
        }
      };
    }
  }
}
