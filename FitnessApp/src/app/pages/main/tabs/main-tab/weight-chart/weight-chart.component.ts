import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PersonalGoalsService } from 'src/app/services/personal-goals.service';

@Component({
  selector: 'app-weight-chart',
  templateUrl: './weight-chart.component.html',
  styleUrls: ['./weight-chart.component.scss'],
})
export class WeightChartComponent implements OnInit, OnDestroy{
  personalGoalsSubscription: any;

  constructor(
    private personalGoalsService: PersonalGoalsService
  ) {
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    this.personalGoalsSubscription.unsubscribe();
  }

  ctx;
  chart;

  ngOnInit() {
   this.createChart();
   this.personalGoalsSubscription = this.personalGoalsService.personalGoalsObserver$.subscribe(value=>{
    if(value)
      console.log('chart subscription')
      this.chart.destroy();
      this.createChart();
  })
  }

  async createChart(){
    const chartDataObject = await this.getAndTransformUserDailyWeight();

    this.ctx = (<HTMLCanvasElement>document.getElementById('weightChart')).getContext('2d');
    this.chart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: chartDataObject.labels,
        datasets: [{
          label: 'Daily weight',
          data: chartDataObject.data,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          }
        },
        spanGaps: true
      }
    });
  }

  async getAndTransformUserDailyWeight(){
    const startDate = new Date();
    startDate.setDate(startDate.getDate()-30);
    const startDateString = startDate.toISOString().split('T')[0];

    const dailyWeightData = await this.personalGoalsService.getUserDailyWeights(startDateString);

    const resultObject = {
      labels: [],
      data: []
    }

    resultObject.labels = this.generateLabels(startDateString);
    resultObject.data = this.createDataForChart(resultObject.labels, dailyWeightData);

    return resultObject;
  }

  createDataForChart(labels: string[], dailyWeightData): any[] {
    const dataResult = []

    labels.forEach((date)=>{
      let weightDataObj = dailyWeightData.filter(d=>
        d.date.includes(date)
      )
      if(weightDataObj.length){
        dataResult.push(weightDataObj[0].weight);
      } else {
        dataResult.push(null);
      }
    })

    return dataResult;
  }

  generateLabels(startDateString: string){
    const startDate = new Date(startDateString);
    const endDate = new Date();

    const dates = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${month}-${day}`;
      dates.push(dateStr);
    }

    return dates;
  }



}
