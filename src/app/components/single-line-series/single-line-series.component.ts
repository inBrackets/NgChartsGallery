import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-single-line-series',
  imports: [
    HighchartsChartComponent,
    NgIf
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    })
  ],
  templateUrl: './single-line-series.component.html',
  standalone: true,
  styleUrl: './single-line-series.component.css'
})
export class SingleLineSeriesComponent implements OnInit {

  masterSrv = inject(MasterService);
  data: [number, number][] = [];
  chartOptions: Highcharts.Options = {}

  ngOnInit(): void {
    this.masterSrv.getAaplC().subscribe((response : [number, number][])=> {
      this.data = response;
      this.updateChart();
    })
  }

  updateChart() {
    this.chartOptions = {
      rangeSelector: {
        selected: 1
      },

      title: {
        text: 'AAPL Stock Price'
      },

      xAxis: {
        overscroll: '10px'
      },

      series: [{
        name: 'AAPL',
        data: this.data,
        type: 'line',
        tooltip: {
          valueDecimals: 2
        },
        lastPrice: {
          enabled: true,
          color: 'transparent',
          label: {
            enabled: true,
            backgroundColor: '#ffffff',
            borderColor: '#2caffe',
            borderWidth: 1,
            style: {
              color: '#000000'
            }
          }
        }
      }]
    }
  }
}
