import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LineChartComponent} from './components/line-chart/line-chart.component';
import {IntradayCandlestickComponent} from './components/intraday-candlestick/intraday-candlestick.component';
import {CandlestickComponent} from './components/candlestick/candlestick.component';
import {SmaAndVolumeByPriceComponent} from './components/sma-and-volume-by-price/sma-and-volume-by-price.component';
import {
  TechnicalIndicatorSeriesRsiComponent
} from './components/technical-indicator-series-rsi/technical-indicator-series-rsi.component';
import {
  TechnicalIndicatorSeriesStochasticComponent
} from './components/technical-indicator-series-stochastic/technical-indicator-series-stochastic.component';
import {
  AllTechnicalIndicatorsComponent
} from './components/all-technical-indicators/all-technical-indicators.component';
import {OrderBookChartComponent} from './components/order-book-chart/order-book-chart.component';
import {SingleLineSeriesComponent} from './components/single-line-series/single-line-series.component';
import {DynamicDataInStockComponent} from './components/dynamic-data-in-stock/dynamic-data-in-stock.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LineChartComponent, IntradayCandlestickComponent, CandlestickComponent, SmaAndVolumeByPriceComponent, TechnicalIndicatorSeriesRsiComponent, TechnicalIndicatorSeriesStochasticComponent, AllTechnicalIndicatorsComponent, OrderBookChartComponent, SingleLineSeriesComponent, DynamicDataInStockComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  title: string = 'NgChartsGallery'
}
