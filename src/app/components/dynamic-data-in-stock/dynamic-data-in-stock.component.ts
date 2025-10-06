import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';
import {NgIf} from '@angular/common';
import {OrderBookService} from '../../services/order-book.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dynamic-data-in-stock',
  imports: [
    HighchartsChartComponent,
    NgIf
  ],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    })
  ],
  templateUrl: './dynamic-data-in-stock.component.html',
  standalone: true,
  styleUrl: './dynamic-data-in-stock.component.css'
})
export class DynamicDataInStockComponent implements OnInit, OnDestroy {

  masterSrv = inject(MasterService);
  data: [number, number, number, number, number][] = [];
  chartOptions: Highcharts.Options = {}

  orderBookService = inject(OrderBookService);
  private subscription?: Subscription;
  bids: Highcharts.PointOptionsObject[] = [];
  asks: Highcharts.PointOptionsObject[] = [];

  Highcharts: typeof Highcharts = Highcharts;
  chart?: Highcharts.Chart;

  ngOnInit(): void {
    this.startLiveLastCandleUpdates()
    this.masterSrv.getAaplOhlc().subscribe((response: [number, number, number, number, number][]) => {
      this.data = response;
      this.initChart();
    })
  }

  startLiveLastCandleUpdates() {
    this.subscription = this.orderBookService
      .startAutoUpdate(1, 1000) // 5 points every 1s
      .subscribe(([bids, asks]) => {
        this.bids = bids;
        this.asks = asks;
        console.log("Bids:")
        console.log(bids);
        console.log("Asks:");
        console.log(asks);

        if (!this.chart) return;

        const series = this.chart.get('aapl-series') as Highcharts.Series | undefined;
        if (!series || !('data' in series) || series.type !== 'candlestick') return;

        const candleSeries = series as { data: Highcharts.Point[] };
        if (!candleSeries.data.length) return;

        const lastPoint = candleSeries.data[candleSeries.data.length - 1];

        const lastPrice = this.calculateMidPrice(bids, asks);
        if (!lastPrice) return;

        // Safely extract candle values from point.options
        const opts = Array.isArray(lastPoint.options)
          ? lastPoint.options
          : (lastPoint.options as any);

        // Handle both array and object formats
        const open = Array.isArray(opts) ? opts[1] : opts.open ?? opts.o ?? 0;
        const high = Array.isArray(opts) ? opts[2] : opts.high ?? opts.h ?? open;
        const low  = Array.isArray(opts) ? opts[3] : opts.low ?? opts.l ?? open;
        const close = lastPrice;

        // Keep candle shape consistent
        const newHigh = Math.max(high, close);
        const newLow = Math.min(low, close);

        // Animate candle update smoothly
        // Disable chart redraw, then trigger a soft redraw after updating
        lastPoint.update(
          [lastPoint.x, open, newHigh, newLow, close],
          false,  // don't redraw yet
          false   // keep animation for next redraw
        );

        // Smoothly redraw the chart
        this.chart.redraw(true); // true = animate
      });
  }

  /** Compute mid-price (average of best bid and ask) */
  private calculateMidPrice(
    bids: (Highcharts.PointOptionsObject | [number, number])[],
    asks: (Highcharts.PointOptionsObject | [number, number])[]
  ): number | null {
    // Helper to extract price from either an object or tuple
    const extractPrice = (point: Highcharts.PointOptionsObject | [number, number]): number | null => {
      if (Array.isArray(point)) {
        // tuple form: [price, volume]
        return Number(point[0]);
      }
      if (typeof point === 'object' && point !== null) {
        return Number(point.y ?? point.x ?? 0);
      }
      return null;
    };

    const bestBid = bids.length ? extractPrice(bids[0]) : null;
    const bestAsk = asks.length ? extractPrice(asks[0]) : null;

    if (bestBid != null && bestAsk != null) {
      return (bestBid + bestAsk) / 2;
    }
    return bestBid ?? bestAsk ?? null;
  }

  initChart() {
    this.chartOptions = {

      chart: {
        width: null, // <- allow Highcharts to auto-fit container
        events: {
          load: () => {
            this.chart = this.Highcharts.charts[0]; // store reference for updates
          }
        }
      },

      rangeSelector: {
        selected: 1
      },

      title: {
        text: 'AAPL Stock Price'
      },

      series: [{
        type: 'candlestick',
        name: 'Dynamic data in Stock',
        data: this.data,
        id: 'aapl-series',
        color: '#FF7F7F',
        upColor: '#90EE90',
        lastPrice: {
          enabled: true,
          label: { enabled: true }
        },
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
      }],
      credits: {
        enabled: false
      }
    }
  }

  stopUpdates() {
    this.subscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopUpdates();
  }
}
