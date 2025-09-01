import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalIndicatorSeriesRsiComponent } from './technical-indicator-series-rsi.component';

describe('TechnicalIndicatorSeriesRsiComponent', () => {
  let component: TechnicalIndicatorSeriesRsiComponent;
  let fixture: ComponentFixture<TechnicalIndicatorSeriesRsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalIndicatorSeriesRsiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalIndicatorSeriesRsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
