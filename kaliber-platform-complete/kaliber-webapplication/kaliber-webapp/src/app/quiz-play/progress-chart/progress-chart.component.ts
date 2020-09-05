import { Component, OnInit } from '@angular/core';
import * as CanvasJS from './canvasjs.min';
@Component({
  selector: 'app-progress-chart',
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.css']
})
export class ProgressChartComponent implements OnInit {
  ngOnInit() {
    const chart = new CanvasJS.Chart('chartContainer', {
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Your knowledge in differenet topics from this quiz'
      },
      data: [{
        type: 'pie',
        showInLegend: true,
        toolTipContent: '<b>{name}</b>: {y} (#percent%)',
        indexLabel: '{name} - #percent%',
        dataPoints: [
          { y: 15, name: 'Arrays' },
          { y: 0, name: 'abstraction' },
          { y: 30, name: 'Inheritance' },
          { y: 80, name: 'DataTypes' },
          { y: 10, name: 'polymorphismS' },
          { y: 15, name: 'Collections'},
          { y: 25, name: 'Encapsulation' }
        ]
      }]
    });

    chart.render();
      }
}

