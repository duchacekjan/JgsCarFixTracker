import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {AuthService} from "../../../../services/auth.service";
import {HelperService} from "../../../../services/helper.service";
import {CommonValidators} from "../../../../common/validators/common.validators";
import {ActivatedRoute, Router} from "@angular/router";
import {MessagesService} from "../../../../services/messages.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  form: FormGroup = new FormGroup({
    'email': new FormControl(null, {
      updateOn: 'change' || 'blur' || 'submit',
      validators: [Validators.required, CommonValidators.firebaseEmail]
    })
  });

  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessagesService
  ) {
  }

  onSubmit() {
    if (this.form.valid) {
      const email = this.form.controls['email'].value;
      this.authService.forgotPassword(email).then(() => {
        this.helperService.resetForm(this.form, this.formGroup);
        this.messageService.showInfo({message: 'messages.resetEmailSend'});
        this.router.navigate(['/auth/sign-in'], {replaceUrl: true, relativeTo: this.route,}).catch();
      });
    }
  }
}
