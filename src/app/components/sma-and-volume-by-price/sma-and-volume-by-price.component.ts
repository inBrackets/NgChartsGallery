import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';
import { HighchartsChartDirective } from 'highcharts-angular';


@Component({
  selector: 'app-sma-and-volume-by-price',
  imports: [
    HighchartsChartComponent,
    HighchartsChartDirective
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [
        import('highcharts/esm/modules/stock'),
        import('highcharts/esm/indicators/indicators'),
        import('highcharts/esm/indicators/volume-by-price')
        //, import('highcharts/indicators/price-channel')
      ],
    })
  ],
  templateUrl: './sma-and-volume-by-price.component.html',
  standalone: true,
  styleUrl: './sma-and-volume-by-price.component.css'
})
export class SmaAndVolumeByPriceComponent implements OnInit {

  masterSrv = inject(MasterService);
  ohlcData: [number, number, number, number, number][] = [];
  vData: [number, number][] = [];
  chartOptions: Highcharts.Options = {};

  groupingUnits:[string, number[] | null][] = [[
    'week',                         // unit name
    [1]                             // allowed multiples
  ], [
    'month',
    [1, 2, 3, 4, 6]
  ]];

  ngOnInit(): void {
    this.masterSrv.getAaplOhlcv().subscribe((response : [number, number, number, number, number, number][])=> {
      this.ohlcData = response.map(([t, o, h, l, c, v]) => [t, o, h, l, c]);
      this.vData = response.map(([t, o, h, l, c, v]) => [t, v]);
      this.updateChart();
    })
  }

  updateChart() {
    this.chartOptions = {

      chart: {
        width: null, // <- allow Highcharts to auto-fit container
      },

      rangeSelector: {
        selected: 2
      },

      title: {
        text: 'AAPL Historical'
      },

      subtitle: {
        text: 'With SMA and Volume by Price technical indicators'
      },

      yAxis: [{
        startOnTick: false,
        endOnTick: false,
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'OHLC'
        },
        height: '60%',
        lineWidth: 2,
        resize: {
          enabled: true
        }
      }, {
        labels: {
          align: 'right',
          x: -3
        },
        title: {
          text: 'Volume'
        },
        top: '65%',
        height: '35%',
        offset: 0,
        lineWidth: 2
      }],

      tooltip: {
        split: true
      },

      plotOptions: {
        series: {
          dataGrouping: {
            units: this.groupingUnits
          }
        }
      },

      series: [{
        type: 'candlestick',
        name: 'AAPL',
        id: 'aapl',
        zIndex: 2,
        data: this.ohlcData
      }, {
        type: 'column',
        name: 'Volume',
        id: 'volume',
        data: this.vData,
        yAxis: 1
      }, {
        type: 'vbp',
        linkedTo: 'aapl',
        params: {
          volumeSeriesID: 'volume'
        },
        dataLabels: {
          enabled: false
        },
        zoneLines: {
          enabled: false
        }
      }, {
        type: 'sma',
        linkedTo: 'aapl',
        zIndex: 1,
        marker: {
          enabled: false
        }
      }],
      credits : {
        enabled: false
      }
    }
  }
}
