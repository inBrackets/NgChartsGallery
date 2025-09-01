import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmaAndVolumeByPriceComponent } from './sma-and-volume-by-price.component';

describe('SmaAndVolumeByPriceComponent', () => {
  let component: SmaAndVolumeByPriceComponent;
  let fixture: ComponentFixture<SmaAndVolumeByPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmaAndVolumeByPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmaAndVolumeByPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
