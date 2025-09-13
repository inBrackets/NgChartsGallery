import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLineSeriesComponent } from './single-line-series.component';

describe('SingleLineSeriesComponent', () => {
  let component: SingleLineSeriesComponent;
  let fixture: ComponentFixture<SingleLineSeriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleLineSeriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleLineSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
