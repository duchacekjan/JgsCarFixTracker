import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarListItemComponent } from './car-list-item.component';

describe('CarListItemComponent', () => {
  let component: CarListItemComponent;
  let fixture: ComponentFixture<CarListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
