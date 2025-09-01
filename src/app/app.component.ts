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

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LineChartComponent, IntradayCandlestickComponent, CandlestickComponent, SmaAndVolumeByPriceComponent, TechnicalIndicatorSeriesRsiComponent, TechnicalIndicatorSeriesStochasticComponent, AllTechnicalIndicatorsComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  title: string = 'NgChartsGallery'
}
