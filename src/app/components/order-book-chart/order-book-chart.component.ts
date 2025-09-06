import {Component, OnDestroy, OnInit} from '@angular/core';
import {HighchartsChartComponent, HighchartsChartDirective} from 'highcharts-angular';
import {OrderBookService} from '../../services/order-book.service';
import {Subscription} from 'rxjs';
import * as Highcharts from 'highcharts/highstock';

function createOrderBookChartOptions(asksData: Highcharts.PointOptionsObject[], bidsData: Highcharts.PointOptionsObject[]): Highcharts.Options {
  return {
    chart: {
      animation: { duration: 200 },
      type: 'bar',
      backgroundColor: '#23232f',
      marginTop: 70
    },

    title: {
      text: 'Order book live chart',
      style: { color: '#ffffff' }
    },

    tooltip: {
      headerFormat: 'Price: <b>${point.price:,.1f}</b></br>',
      pointFormat: '{series.name}: <b>{point.y:,.0f}</b>'
    },

    xAxis: [{ visible: false }, { visible: false }],
    yAxis: [{ min: 0, max: 1200000 }, { min: 0, max: 1200000, reversed: true }],

    legend: { enabled: false },

    plotOptions: {
      series: {
        animation: false,
        borderWidth: 0,
        dataLabels: { enabled: true, color: '#ffffff' }
      }
    },

    series: [{
      type: 'bar',
      name: 'Asks',
      color: '#ce4548',
      data: asksData
    }, {
      type: 'bar',
      name: 'Bids',
      color: '#107db7',
      yAxis: 1,
      data: bidsData
    }]
  };
}

@Component({
  selector: 'app-order-book-chart',
  imports: [
    HighchartsChartComponent,
    HighchartsChartDirective
  ],
  templateUrl: './order-book-chart.component.html',
  standalone: true,
  styleUrl: './order-book-chart.component.css'
})
export class OrderBookChartComponent implements OnInit, OnDestroy {
  bids: Highcharts.PointOptionsObject[] = [];
  asks: Highcharts.PointOptionsObject[] = [];
  updatesEnabled = false;

  private subscription?: Subscription;
  protected chartOptions: Highcharts.Options = {};

  constructor(private orderBookService: OrderBookService) {}

  ngOnInit(): void {
    // Optionally start immediately
    this.startUpdates();
  }

  toggleUpdates() {
    this.updatesEnabled ? this.stopUpdates() : this.startUpdates();
  }

  startUpdates() {
    this.subscription = this.orderBookService
      .startAutoUpdate(10, 1000) // 10 points every 1s
      .subscribe(([bids, asks]) => {
        this.bids = bids;
        this.asks = asks;
        this.chartOptions = createOrderBookChartOptions(asks, bids);
        console.log("Bids:")
        console.log(bids);
        console.log("Asks:");
        console.log(asks);
      });
    this.updatesEnabled = true;
  }

  stopUpdates() {
    this.subscription?.unsubscribe();
    this.updatesEnabled = false;
  }

  ngOnDestroy(): void {
    this.stopUpdates();
  }

}
