import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHighcharts} from 'highcharts-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHighcharts(),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
};
