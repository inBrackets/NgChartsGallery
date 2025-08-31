import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {LineChartComponent} from './components/line-chart/line-chart.component';
import {IntradayCandlestickComponent} from './components/intraday-candlestick/intraday-candlestick.component';
import {CandlestickComponent} from './components/candlestick/candlestick.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LineChartComponent, IntradayCandlestickComponent, CandlestickComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {

  title: string = 'NgChartsGallery'
}
