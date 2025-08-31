import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntradayCandlestickComponent } from './intraday-candlestick.component';

describe('IntradayCandlestickComponent', () => {
  let component: IntradayCandlestickComponent;
  let fixture: ComponentFixture<IntradayCandlestickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntradayCandlestickComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntradayCandlestickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
