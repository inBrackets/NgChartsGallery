import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTechnicalIndicatorsComponent } from './all-technical-indicators.component';

describe('AllTechnicalIndicatorsComponent', () => {
  let component: AllTechnicalIndicatorsComponent;
  let fixture: ComponentFixture<AllTechnicalIndicatorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTechnicalIndicatorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllTechnicalIndicatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
