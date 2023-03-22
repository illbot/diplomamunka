import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.scss'],
})
export class WeightChartComponent implements OnInit{

  constructor() {
    Chart.register(...registerables);
  }

  ctx: HTMLCanvasElement;

  ngOnInit() {
    const labels = [
      "2023-03-01",
      "2023-03-02",
      "2023-03-03",
      "2023-03-04",
      "2023-03-05",
      "2023-03-06",
      "2023-03-07",
      "2023-03-08",
      "2023-03-09",
      "2023-03-10",
      "2023-03-11",
      "2023-03-12",
      "2023-03-13",
      "2023-03-14",
      "2023-03-15",
      "2023-03-16",
      "2023-03-17",
      "2023-03-18",
      "2023-03-19",
      "2023-03-20",
      "2023-03-21",
      "2023-03-22",
      "2023-03-23",
      "2023-03-24",
    ]

    const data = [
      82,82,81,81,81,81,80,80,80,80,80,79,null,null,79,79,78,78,78,78,77,77,77
    ]

    const ctx = (<HTMLCanvasElement>document.getElementById('weightChart')).getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily weight',
          data: data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          }
        },
      }
    });
  }
}
