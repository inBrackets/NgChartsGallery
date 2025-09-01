import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalIndicatorSeriesStochasticComponent } from './technical-indicator-series-stochastic.component';

describe('TechnicalIndicatorSeriesStochasticComponent', () => {
  let component: TechnicalIndicatorSeriesStochasticComponent;
  let fixture: ComponentFixture<TechnicalIndicatorSeriesStochasticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalIndicatorSeriesStochasticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalIndicatorSeriesStochasticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
