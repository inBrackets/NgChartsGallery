import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataInStockComponent } from './dynamic-data-in-stock.component';

describe('DynamicDataInStockComponent', () => {
  let component: DynamicDataInStockComponent;
  let fixture: ComponentFixture<DynamicDataInStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicDataInStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDataInStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
