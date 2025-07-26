import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import * as Highcharts from 'highcharts';
import {HighchartsChartComponent} from 'highcharts-angular';
import {MasterService} from './services/master.service';
import {NumberOfEmployees} from './model/master.model';
import {HttpClient} from '@angular/common/http';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HighchartsChartComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private http: HttpClient) { }

  title: string =  'NgChartsGallery'

  masterSrv = inject(MasterService);
  installationAndDevelopersArray: NumberOfEmployees[] = [];
  manufacturingArray: NumberOfEmployees[] = [];
  chartOptions: Highcharts.Options = {}

  updateChart() {
    this.chartOptions = {
      title: {
        text: 'U.S Solar Employment Growth',
        align: 'left'
      },

      subtitle: {
        text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
        align: 'left'
      },

      yAxis: {
        title: {
          text: 'Number of Employees'
        }
      },

      xAxis: {
        accessibility: {
          rangeDescription: 'Range: 2010 to 2022'
        }
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },

      series: [{
        name: 'Installation & Developers',
        type: 'line',
        data: this.installationAndDevelopersArray.map(item => ({
          x: item.year,
          y: item.employees
        }))
      }, {
        name: 'Manufacturing',
        type: 'line',
        data: this.manufacturingArray.map(item => ({
          x: item.year,
          y: item.employees
        }))
      }, {
        name: 'Sales & Distribution',
        type: 'line',
        data: [
          11744, 30000, 16005, 19771, 20185, 24377,
          32147, 30912, 29243, 29213, 25663, 28978, 30618
        ]
      }, {
        name: 'Operations & Maintenance',
        type: 'line',
        data: [
          null, null, null, null, null, null, null,
          null, 11164, 11218, 10077, 12530, 16585
        ]
      }, {
        name: 'Other',
        type: 'line',
        data: [
          21908, 5548, 8105, 11248, 8989, 11816, 18274,
          17300, 13053, 11906, 10073, 11471, 11648
        ]
      }],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom'
            }
          }
        }]
      }
    };
  }

  ngOnInit(): void {
    forkJoin({
      installation: this.masterSrv.getInstallationAndDevelopers(),
      manufacturing: this.masterSrv.getManufacturing()
    }).subscribe(({ installation, manufacturing }) => {
      this.installationAndDevelopersArray = installation;
      this.manufacturingArray = manufacturing;
      this.updateChart();
    });
  }
}
