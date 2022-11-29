import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthHintComponent } from './password-strength-hint.component';

describe('PasswordStrengthHintComponent', () => {
  let component: PasswordStrengthHintComponent;
  let fixture: ComponentFixture<PasswordStrengthHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordStrengthHintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordStrengthHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
