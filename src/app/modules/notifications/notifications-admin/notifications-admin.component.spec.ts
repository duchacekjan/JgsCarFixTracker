import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsAdminComponent } from './notifications-admin.component';

describe('NotificationsAdminComponent', () => {
  let component: NotificationsAdminComponent;
  let fixture: ComponentFixture<NotificationsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationsAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
