import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, HighchartsChartDirective, providePartialHighcharts} from 'highcharts-angular';

@Component({
  selector: 'app-technical-indicator-series-rsi',
  imports: [
    HighchartsChartComponent,
    HighchartsChartDirective
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [
        import('highcharts/esm/modules/stock'),
        import('highcharts/esm/indicators/indicators'),
        import('highcharts/esm/indicators/rsi')
      ],
    })
  ],
  templateUrl: './technical-indicator-series-rsi.component.html',
  standalone: true,
  styleUrl: './technical-indicator-series-rsi.component.css'
})
export class TechnicalIndicatorSeriesRsiComponent implements OnInit {

  masterSrv = inject(MasterService);
  data: [number, number, number, number, number][] = [];
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.masterSrv.getAaplOhlc().subscribe((response: [number, number, number, number, number][]) => {
      this.data = response
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
        text: 'AAPL Stock Price'
      },

      legend: {
        enabled: true
      },

      plotOptions: {
        series: {
          showInLegend: true
        }
      },

      yAxis: [{
        height: '48%'
      }, {
        height: '48%',
        top: '52%'
      }],

      series: [{
        type: 'ohlc',
        id: 'aapl',
        name: 'AAPL Stock Price',
        data: this.data
      }, {
        yAxis: 1,
        type: 'rsi',
        linkedTo: 'aapl'
      }],
      credits : {
        enabled: false
      }
    }
  }
}
