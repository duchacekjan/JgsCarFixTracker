import {Component, ViewChild} from '@angular/core';
import {PasswordService, PasswordStrength} from "../../../../services/password.service";
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {HelperService} from "../../../../services/helper.service";
import {CommonValidators} from "../../../../common/validators/common.validators";
import {PasswordStrengthInfo} from "../../../../common/password-strength-hint/password-strength-hint.component";
import {MessagesService} from "../../../../services/messages.service";

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.scss']
})
export class ConfirmResetPasswordComponent {
  passwordStrength: PasswordStrengthInfo = {
    strength: PasswordStrength.Weak,
    score: 0,
    color: 'warn',
    text: ''
  };
  form = new FormGroup({
      'password': new FormControl(null, [CommonValidators.strongPassword, Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl(null, {
        updateOn: 'change' || 'blur' || 'submit',
        validators: [Validators.required]
      })
    },
    [CommonValidators.formMismatchPassword('password', 'confirmPassword')])
  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  private oobCode = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
    private readonly passwordService: PasswordService,
    private readonly messageService: MessagesService) {
    this.form.get('password')!.valueChanges.subscribe(() => this.onPasswordChanged())
  }

  get passwordError() {
    let result = '';
    const passwordCtrl = this.form.get('password');
    if (!passwordCtrl || !passwordCtrl.touched) {
      return result;
    }
    if (passwordCtrl.hasError('required')) {
      result = 'required';
    } else if (passwordCtrl.hasError('minlength')) {
      result = 'minlength';
    } else if (passwordCtrl.hasError('weakpassword')) {
      result = 'weakpassword';
    }
    return result;
  }

  ngOnInit(): void {
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode') ?? '';
  }

  onSubmit() {
    if (this.form.valid) {
      const password = this.form.value.password!;
      this.authService.confirmPasswordReset(password, this.oobCode)
        .then(() => {
          this.helperService.resetForm(this.form, this.formGroup);
          this.router.navigate(['/auth/sign-in'], {replaceUrl: true, relativeTo: this.route}).catch();
        })
        .catch(err => this.messageService.showError(err));
    }
  }

  private onPasswordChanged() {
    const passwordCtrl = this.form.get('password');
    if (!passwordCtrl) {
      this.passwordStrength.score = 0;
      return;
    }
    const password = passwordCtrl.getRawValue();
    if (password) {
      this.passwordStrength.score = this.passwordService.getScore(password);
      this.passwordStrength.strength = this.passwordService.getStrength(password);
      switch (this.passwordStrength.strength) {
        case PasswordStrength.Weak:
          this.passwordStrength.color = 'warn';
          this.passwordStrength.text = 'auth.confirmResetPassword.weakPassword';
          break;
        case PasswordStrength.Moderate:
          this.passwordStrength.color = 'accent';
          this.passwordStrength.text = 'auth.confirmResetPassword.moderatePassword';
          break;
        case PasswordStrength.Strong:
          this.passwordStrength.color = 'primary';
          this.passwordStrength.text = 'auth.confirmResetPassword.strongPassword';
          break;

      }
    } else {
      this.passwordStrength.score = 0;
    }
  }
}
