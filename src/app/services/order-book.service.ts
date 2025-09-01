import { Injectable } from '@angular/core';
import {interval, map, Observable, startWith} from 'rxjs';

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
  generateBidAndAskData(n: number): [OrderPoint[], OrderPoint[]] {
    const bids: OrderPoint[] = [];
    const asks: OrderPoint[] = [];

    let bidPrice = this.getRandomNumber(29000, 30000);
    let askPrice = bidPrice + 0.5;

    for (let i = 0; i < n; i++) {
      bidPrice -= i * this.getRandomNumber(8, 10);
      askPrice += i * this.getRandomNumber(8, 10);

      bids.push({
        x: i,
        y: (i + 1) * this.getRandomNumber(70000, 110000),
        price: bidPrice,
      });

      asks.push({
        x: i,
        y: (i + 1) * this.getRandomNumber(70000, 110000),
        price: askPrice,
      });
    }

    return [bids, asks];
  }

  /**
   * Create a stream that emits random bid/ask data every intervalMs ms
   * @param n number of points
   * @param intervalMs update frequency
   */
  startAutoUpdate(n: number, intervalMs: number): Observable<[OrderPoint[], OrderPoint[]]> {
    return interval(intervalMs).pipe(
      startWith(0), // emit immediately on subscribe
      map(() => this.generateBidAndAskData(n))
    );
  }
}

export interface OrderPoint {
  x: number;
  y: number;
  price: number;
}
