import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailFormComponent } from './car-detail-form.component';

describe('CarDetailFormComponent', () => {
  let component: CarDetailFormComponent;
  let fixture: ComponentFixture<CarDetailFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarDetailFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDetailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
