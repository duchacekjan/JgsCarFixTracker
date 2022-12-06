import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {HelperService} from "../../../../services/helper.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup = new FormGroup({
    'email': new FormControl(null, [Validators.required, Validators.email])
  });

  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService
  ) {
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.controls['email'].value;
      this.authService.forgotPassword(email).then(() => this.helperService.resetForm(this.form, this.formGroup));
    }
  }
}
