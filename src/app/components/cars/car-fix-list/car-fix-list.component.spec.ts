import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarFixListComponent } from './car-fix-list.component';

describe('CarFixListComponent', () => {
  let component: CarFixListComponent;
  let fixture: ComponentFixture<CarFixListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarFixListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarFixListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
