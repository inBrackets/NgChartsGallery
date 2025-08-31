import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';

@Component({
  selector: 'app-intraday-candlestick',
  imports: [
    HighchartsChartComponent
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    })
  ],
  templateUrl: './intraday-candlestick.component.html',
  standalone: true,
  styleUrl: './intraday-candlestick.component.css'
})
export class IntradayCandlestickComponent implements OnInit {

  masterSrv = inject(MasterService);
  data: [number, number, number, number, number][] = [];
  chartOptions: Highcharts.Options = {}

  ngOnInit(): void {
    this.masterSrv.getNewIntraday().subscribe((response : [number, number, number, number, number][])=> {
      this.data = response;
      this.updateChart();
    })
  }

  updateChart() {
    this.chartOptions = {

      title: {
        text: 'AAPL stock price by minute'
      },

      rangeSelector: {
        buttons: [{
          type: 'hour',
          count: 1,
          text: '1h'
        }, {
          type: 'day',
          count: 1,
          text: '1D'
        }, {
          type: 'all',
          count: 1,
          text: 'All'
        }],
        selected: 1,
        inputEnabled: false
      },

      series: [{
        name: 'AAPL',
        type: 'candlestick',
        data: this.data,
        tooltip: {
          valueDecimals: 2
        }
      }]
    }
  }
}
