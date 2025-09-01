import {Component, OnDestroy, OnInit} from '@angular/core';
import {HighchartsChartComponent, HighchartsChartDirective} from 'highcharts-angular';
import {OrderBookService, OrderPoint} from '../../services/order-book.service';
import {Subscription} from 'rxjs';

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
  bids: OrderPoint[] = [];
  asks: OrderPoint[] = [];
  updatesEnabled = false;

  private subscription?: Subscription;

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
