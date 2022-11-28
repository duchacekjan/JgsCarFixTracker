import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email])
  });

  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.controls['email'].value;
      this.authService.forgotPassword(email).then(() => this.resetForm());
    }
  }

  private resetForm() {
    this.form.reset();
    this.form.setErrors(null);
    this.form.updateValueAndValidity();
    this.formGroup.resetForm();
  }
}
