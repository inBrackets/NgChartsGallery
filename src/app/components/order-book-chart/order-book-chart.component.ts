import {Component, OnDestroy, OnInit} from '@angular/core';
import {HighchartsChartComponent, HighchartsChartDirective} from 'highcharts-angular';
import {OrderBookService} from '../../services/order-book.service';
import {Subscription} from 'rxjs';
import * as Highcharts from 'highcharts/highstock';
import {NgIf} from "@angular/common";

function createOrderBookChartOptions(asksData: Highcharts.PointOptionsObject[], bidsData: Highcharts.PointOptionsObject[]): Highcharts.Options {
  return {
    chart: {
      animation: {
        duration: 200
      },
      type: 'bar',
      backgroundColor: '#23232f',
      width: null, // <- allow Highcharts to auto-fit container
      marginTop: 70
    },

    title: {
      text: 'Order book live chart',
      style: {
        color: '#ffffff'
      }
    },

    tooltip: {
      headerFormat: 'Price: <b>${point.price:,.1f}</b></br>',
      pointFormat: '{series.name}: <b>{point.y:,.0f}</b>'
    },

    xAxis: [{
      reversed: true,
      visible: false,
      title: {
        text: 'Market depth / price'
      },
      accessibility: {
        description: 'Bid orders'
      }
    }, {
      opposite: true,
      visible: false,
      title: {
        text: 'Market depth / price'
      },
      accessibility: {
        description: 'Ask orders'
      }
    }],
    yAxis: [{
      offset: 0,
      visible: true,
      opposite: true,
      gridLineWidth: 0,
      tickAmount: 1,
      left: '50%',
      width: '50%',
      title: {
        text: 'Amount of ask orders',
        style: {
          visibility: 'hidden'
        }
      },
      min: 0,
      max: 1200000,
      labels: {
        enabled: true,
        formatter: function () {
          if ((this as any).isLast) return 'Asks';
          return '';
        },
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '700'
        },
        y: 10
      }
    }, {
      offset: 0,
      visible: true,
      opposite: true,
      gridLineWidth: 0,
      tickAmount: 2,
      left: '0%',
      width: '50%',
      reversed: true,
      title: {
        text: 'Amount of bid orders',
        style: {
          visibility: 'hidden'
        }
      },
      min: 0,
      max: 1200000,
      labels: {
        enabled: true,
        formatter: function () {
          const instrument = "$"
          if ((this as any).pos === 0) return `Price (${instrument})`;
          if (this.isLast) return 'Bids';
          return '';
        },
        style: {
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '700'
        },
        y: 10
      }
    }],

    legend: {
      itemStyle: {color: '#ffffff', fontSize: '14px'}
    },

    navigation: {
      buttonOptions: {
        theme: {
          fill: 'none'
        }
      }
    },

    plotOptions: {
      series: {
        animation: false,
        dataLabels: {
          enabled: true,
          color: '#ffffff'
        },
        borderWidth: 0,
        crisp: false
      }
    },

    series: [{
      type: 'bar',
      pointWidth: 25, // thicker bars (Asks)
      dataLabels: [{
        // volume labels (Asks)
        align: 'right',
        alignTo: 'plotEdges',
        format: '{point.y:,.0f}',
        style: {fontSize: '14px', textOutline: 'none'},
      }, {
        // prices labels (Asks)
        align: 'left',
        inside: true,
        format: '{point.price:,.1f}',
        style: { fontSize: '16px', textOutline: 'none', color: '#fff' }
      }],
      name: 'Asks',
      color: '#ce4548',
      data: asksData
    }, {
      type: 'bar',
      pointWidth: 25, // thicker bars (Bids)
      dataLabels: [{
        // volume labels (Bids)
        align: 'left',
        alignTo: 'plotEdges',
        format: '{point.y:,.0f}',
        style: {fontSize: '14px', textOutline: 'none'},
      }, {
        // prices labels (Bids)
        align: 'right',
        inside: true,
        format: '{point.price:,.1f}',
        style: { fontSize: '16px', textOutline: 'none', color: '#fff' }
      }],
      name: 'Bids',
      color: '#107db7',
      data: bidsData,
      yAxis: 1
    }],
    credits : {
      enabled: false
    }
  };
}

@Component({
  selector: 'app-order-book-chart',
    imports: [
        HighchartsChartComponent,
        HighchartsChartDirective,
        NgIf
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
      .startAutoUpdate(10, 200) // 10 points every 1s
      .subscribe(([bids, asks]) => {
        this.bids = bids;
        this.asks = asks;
        this.chartOptions = createOrderBookChartOptions(asks, bids);
        // console.log("Bids:")
        // console.log(bids);
        // console.log("Asks:");
        // console.log(asks);
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
