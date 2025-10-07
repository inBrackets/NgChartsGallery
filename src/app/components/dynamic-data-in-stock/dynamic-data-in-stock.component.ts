import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MasterService} from '../../services/master.service';
import * as Highcharts from 'highcharts/highstock';
import {HighchartsChartComponent, providePartialHighcharts} from 'highcharts-angular';
import {NgIf} from '@angular/common';
import {OrderBookService} from '../../services/order-book.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-dynamic-data-in-stock',
  standalone: true,
  templateUrl: './dynamic-data-in-stock.component.html',
  styleUrl: './dynamic-data-in-stock.component.css',
  imports: [HighchartsChartComponent, NgIf],
  providers: [
    providePartialHighcharts({
      modules: () => [import('highcharts/esm/modules/stock')],
    }),
  ],
})
export class DynamicDataInStockComponent implements OnInit, OnDestroy {
  masterSrv = inject(MasterService);
  orderBookService = inject(OrderBookService);

  data: [number, number, number, number, number][] = [];
  chartOptions: Highcharts.Options = {};
  Highcharts: typeof Highcharts = Highcharts;
  chart?: Highcharts.Chart;
  bids: Highcharts.PointOptionsObject[] = [];
  asks: Highcharts.PointOptionsObject[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.masterSrv.getAaplOhlc().subscribe((response) => {
      this.data = response;
      this.initChart();
      setTimeout(() => this.startLiveLastCandleUpdates(), 300);
    });
  }

  onChartInstance(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  startLiveLastCandleUpdates() {
    this.subscription = this.orderBookService.startAutoUpdate(1, 1000)
      .subscribe(([bids, asks]) => {
        console.log('Bids:', bids);
        console.log('Asks:', asks);
        this.bids = bids;
        this.asks = asks;
        this.updateLastCandleWithMidPrice();
      });
  }

  updateLastCandleWithMidPrice() {
    if (!this.chart) return;

    const series = this.chart.get('aapl-series') as Highcharts.Series | undefined;
    const liveLine = this.chart.get('live-price-line') as Highcharts.Series | undefined;
    if (!series || !('data' in series) || !series.data.length) return;

    const lastPoint = series.data.at(-1)!;
    const lastMid = this.calculateMidPrice(this.bids, this.asks);
    if (lastMid == null) return;

    const opts = lastPoint.options;
    const open = opts.open ?? 0;
    const high = opts.high ?? 0;
    const low  = opts.low ?? 0;
    const close = lastMid;

    // Update candle smoothly
    lastPoint.update(
      [lastPoint.x, open, Math.max(high, close), Math.min(low, close), close],
      true,
      { duration: 300, easing: 'easeOutQuad' }
    );

    // Update live line smoothly
    if (liveLine) {
      liveLine.addPoint([Date.now(), close], true, true, { duration: 300 });
    }
  }


  private calculateMidPrice(
    bids: (Highcharts.PointOptionsObject | [number, number])[],
    asks: (Highcharts.PointOptionsObject | [number, number])[]
  ): number | null {
    const extractPrice = (p: any) =>
      Array.isArray(p) ? +p[0] : +((p?.price ?? p?.y ?? p?.x) ?? 0);

    const bestBid = bids.length ? Math.max(...bids.map(extractPrice)) : null;
    const bestAsk = asks.length ? Math.min(...asks.map(extractPrice)) : null;

    if (bestBid != null && bestAsk != null) return (bestBid + bestAsk) / 2;
    return bestBid ?? bestAsk ?? null;
  }

  initChart() {
    this.chartOptions = {
      chart: { width: null },
      rangeSelector: { selected: 1 },
      title: { text: 'AAPL Stock Price' },
      series: [{
        type: 'candlestick',
        id: 'aapl-series',
        name: 'Dynamic data in Stock',
        data: this.data,
        color: '#FF7F7F',
        upColor: '#90EE90',
        lastPrice: { enabled: true, label: { enabled: true } },
      }],
      credits: { enabled: false },
    };
  }

  stopUpdates() {
    this.subscription?.unsubscribe();
  }

  ngOnDestroy(): void {
    this.stopUpdates();
  }
}
