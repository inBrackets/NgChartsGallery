import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';

@Component({
  selector: 'app-candlestick',
  imports: [
    HighchartsChartComponent
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    })
  ],
  templateUrl: './candlestick.component.html',
  standalone: true,
  styleUrl: './candlestick.component.css'
})
export class CandlestickComponent implements OnInit {

  masterSrv = inject(MasterService);
  data: [number, number, number, number, number][] = [];
  chartOptions: Highcharts.Options = {}

  ngOnInit(): void {
    this.masterSrv.getAaplOhlc().subscribe((response : [number, number, number, number, number][])=> {
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

      series: [{
        type: 'candlestick',
        name: 'AAPL Stock Price',
        data: this.data,
        dataGrouping: {
          units: [
            [
              'week', // unit name
              [1] // allowed multiples
            ], [
              'month',
              [1, 2, 3, 4, 6]
            ]
          ]
        }
      }]
    }
  }
}
