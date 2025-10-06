import { Injectable } from '@angular/core';
import { interval, map, Observable, startWith } from 'rxjs';
import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class OrderBookService {

  constructor() { }

  private getRandomNumber(min: number, max: number): number {
    return Math.round(Math.random() * (max - min)) + min;
  }

  /**
   * Generate random bid and ask data
   * @param n number of points
   * @returns [bids[], asks[]]
   */
  generateBidAndAskData(n: number): [Highcharts.PointOptionsObject[], Highcharts.PointOptionsObject[]] {
    const bids: Highcharts.PointOptionsObject[] = [];
    const asks: Highcharts.PointOptionsObject[] = [];

    let bidPrice = this.getRandomNumber(220, 240);
    let askPrice = bidPrice + 0.5;

    for (let i = 0; i < n; i++) {
      bidPrice -= i * this.getRandomNumber(8, 10);
      askPrice += i * this.getRandomNumber(8, 10);

      bids.push({
        x: i,
        y: (i + 1) * this.getRandomNumber(70000, 110000),
        // 👇 Highcharts lets you add custom fields
        price: bidPrice
      } as Highcharts.PointOptionsObject);

      asks.push({
        x: i,
        y: (i + 1) * this.getRandomNumber(70000, 110000),
        price: askPrice
      } as Highcharts.PointOptionsObject);
    }

    return [bids, asks];
  }

  /**
   * Create a stream that emits random bid/ask data every intervalMs ms
   * @param n number of points
   * @param intervalMs update frequency
   */
  startAutoUpdate(n: number, intervalMs: number): Observable<[Highcharts.PointOptionsObject[], Highcharts.PointOptionsObject[]]> {
    return interval(intervalMs).pipe(
      startWith(0), // emit immediately on subscribe
      map(() => this.generateBidAndAskData(n))
    );
  }
}
