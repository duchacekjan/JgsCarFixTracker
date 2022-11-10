import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarFixItemComponent } from './car-fix-item.component';

describe('CarFixItemComponent', () => {
  let component: CarFixItemComponent;
  let fixture: ComponentFixture<CarFixItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarFixItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarFixItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
