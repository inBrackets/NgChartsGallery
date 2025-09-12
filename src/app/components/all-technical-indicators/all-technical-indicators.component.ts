import {Component, inject, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, HighchartsChartDirective, providePartialHighcharts} from 'highcharts-angular';

@Component({
  selector: 'app-all-technical-indicators',
  imports: [
    HighchartsChartComponent,
    HighchartsChartDirective
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [
        import('highcharts/esm/modules/stock'),
        import('highcharts/esm/indicators/indicators'),

        import('highcharts/esm/indicators/macd'),
        import('highcharts/esm/indicators/price-channel')
      ],
    })
  ],
  templateUrl: './all-technical-indicators.component.html',
  standalone: true,
  styleUrl: './all-technical-indicators.component.css'
})
export class AllTechnicalIndicatorsComponent implements OnInit {

  masterSrv: MasterService = inject(MasterService);
  ohlcData: [number, number, number, number, number][] = [];
  vData: [number, number][] = [];
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.masterSrv.getAaplOhlcv().subscribe((response: [number, number, number, number, number, number][]) => {
      this.ohlcData = response.map(([t, o, h, l, c, v]) => [t, o, h, l, c]);
      this.vData = response.map(([t, o, h, l, c, v]) => [t, v]);
      this.updateChart();
    })
  }

  updateChart() {
    this.chartOptions = {
      chart: {
        height: 600,
        width: null // <- allow Highcharts to auto-fit container
      },
      title: {
        text: 'AAPL Historical'
      },
      subtitle: {
        text: 'All indicators'
      },
      accessibility: {
        series: {
          descriptionFormat: '{seriesDescription}.'
        },
        description: 'Use the dropdown menus above to display different ' +
          'indicator series on the chart.',
        screenReaderSection: {
          beforeChartFormat: '<{headingTagName}>' +
            '{chartTitle}</{headingTagName}><div>' +
            '{typeDescription}</div><div>{chartSubtitle}</div><div>' +
            '{chartLongdesc}</div>'
        }
      },
      legend: {
        enabled: true
      },
      rangeSelector: {
        selected: 2
      },
      yAxis: [{
        height: '60%'
      }, {
        top: '60%',
        height: '20%'
      }, {
        top: '80%',
        height: '20%'
      }],
      plotOptions: {
        series: {
          showInLegend: true,
          accessibility: {
            exposeAsGroupOnly: true
          }
        }
      },
      series: [{
        type: 'candlestick',
        id: 'aapl',
        name: 'AAPL',
        data: this.ohlcData
      }, {
        type: 'column',
        id: 'volume',
        name: 'Volume',
        data: this.vData,
        yAxis: 1
      }, {
        type: 'pc',
        id: 'overlay',
        linkedTo: 'aapl',
        yAxis: 0
      }, {
        type: 'macd',
        id: 'oscillator',
        linkedTo: 'aapl',
        yAxis: 2,
        params: {
          shortPeriod: 5,   // instead of 12
          longPeriod: 35,   // instead of 26
          signalPeriod: 7   // instead of 9
        }
      }],
      credits : {
        enabled: false
      }

      // TODO: Add other js methods from the website
    }
  }
}
