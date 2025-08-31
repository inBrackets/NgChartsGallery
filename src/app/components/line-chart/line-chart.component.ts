import {Component, inject, OnInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import {HighchartsChartComponent} from 'highcharts-angular';
import {MasterService} from '../../services/master.service';
import {NumberOfEmployees} from '../../model/master.model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-line-chart',
  imports: [
    HighchartsChartComponent
  ],
  templateUrl: './line-chart.component.html',
  standalone: true,
  styleUrl: './line-chart.component.css'
})
export class LineChartComponent implements OnInit {

  masterSrv = inject(MasterService);
  installationAndDevelopersArray: NumberOfEmployees[] = [];
  manufacturingArray: NumberOfEmployees[] = [];
  salesAndDistributionArray: NumberOfEmployees[] = [];
  operationsAndMaintenanceArray: NumberOfEmployees[] = [];
  otherArray: NumberOfEmployees[] = [];
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
        data: this.salesAndDistributionArray.map(item => ({
          x: item.year,
          y: item.employees
        }))
      }, {
        name: 'Operations & Maintenance',
        type: 'line',
        data: this.operationsAndMaintenanceArray.map(item => ({
          x: item.year,
          y: item.employees
        }))
      }, {
        name: 'Other',
        type: 'line',
        data: this.otherArray.map(item => ({
          x: item.year,
          y: item.employees
        }))
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
      manufacturing: this.masterSrv.getManufacturing(),
      sales: this.masterSrv.geSalesAndDistribution(),
      operations: this.masterSrv.getOperationsAndMaintenance(),
      other: this.masterSrv.getOther()

    }).subscribe(({installation, manufacturing, sales, operations, other}) => {
      this.installationAndDevelopersArray = installation;
      this.manufacturingArray = manufacturing;
      this.salesAndDistributionArray = sales;
      this.operationsAndMaintenanceArray = operations;
      this.otherArray = other;
      this.updateChart();
    });
  }
}
