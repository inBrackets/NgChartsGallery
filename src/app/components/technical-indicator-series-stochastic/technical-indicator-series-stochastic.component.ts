import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, HighchartsChartDirective, providePartialHighcharts} from 'highcharts-angular';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-technical-indicator-series-stochastic',
  imports: [
    HighchartsChartComponent,
    HighchartsChartDirective,
    NgIf
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [
        import('highcharts/esm/modules/stock'),
        import('highcharts/esm/indicators/indicators'),
        import('highcharts/esm/indicators/stochastic')
      ],
    })
  ],
  templateUrl: './technical-indicator-series-stochastic.component.html',
  standalone: true,
  styleUrl: './technical-indicator-series-stochastic.component.css'
})
export class TechnicalIndicatorSeriesStochasticComponent implements OnInit {

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
        type: 'stochastic',
        linkedTo: 'aapl',
        tooltip: {
          pointFormat: 'K: <b>{point.y:.2f}</b>, D: <b>{point.smoothed:.2f}</b><br/>'
        }
      }],
      credits : {
        enabled: false
      }
    }
  }
}
