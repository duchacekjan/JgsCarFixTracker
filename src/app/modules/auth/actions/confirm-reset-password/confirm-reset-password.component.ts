import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {Subscription} from "rxjs";
import {CommonService, PasswordRules, PasswordStrength} from "../../../../services/common.service";
import {CustomValidators} from "../../../../common/CustomValidators";
import {PasswordStrengthInfo} from "../../password-strength-hint/password-strength-hint.component";

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.scss']
})
export class ConfirmResetPasswordComponent implements OnInit, OnDestroy {

  passwordStrength: PasswordStrengthInfo = {
    strength: PasswordStrength.Weak,
    score: 0,
    color: 'warn',
    text: ''
  };
  form = new FormGroup({
      'password': new FormControl(null, [CustomValidators.strongPassword, Validators.required, Validators.minLength(6)]),
      'confirmPassword': new FormControl(null, {
        updateOn: 'change' || 'blur' || 'submit',
        validators: [Validators.required]
      })
    },
    [CustomValidators.formMismatchPassword('password', 'confirmPassword')])
  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  private queryParamMapSubscription = new Subscription();
  private oobCode = '';
  private readonly passwordRules = new PasswordRules();

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private commonService: CommonService) {
    this.queryParamMapSubscription = this.route.queryParamMap.subscribe(map => this.processQueryParamMap(map));
    this.form.get('password')!.valueChanges.subscribe(() => this.onPasswordChanged())
  }

  get passwordError() {
    let result = '';
    const passwordCtrl = this.form.get('password');
    if (!passwordCtrl || !passwordCtrl.touched) {
      return result;
    }
    console.log(passwordCtrl.errors);
    if (passwordCtrl.hasError('required')) {
      result = 'required';
    } else if (passwordCtrl.hasError('minlength')) {
      result = 'minlength';
    } else if (passwordCtrl.hasError('weakpassword')) {
      result = 'weakpassword';
    }
    console.log('result');
    return result;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.queryParamMapSubscription.unsubscribe();
  }

  onSubmit() {
    if (this.form.valid) {
      const password = this.form.value.password!;
      this.authService.confirmPasswordReset(password, this.oobCode)
        .then(() => this.commonService.resetForm(this.form, this.formGroup));
    }
  }

  private processQueryParamMap(map: ParamMap) {
    this.oobCode = map.get('oobCode') ?? '';
  }

  private onPasswordChanged() {
    const passwordCtrl = this.form.get('password');
    if (!passwordCtrl) {
      this.passwordStrength.score = 0;
      return;
    }
    const password = passwordCtrl.getRawValue();
    if (password) {
      this.passwordStrength.score = this.passwordRules.getScore(password);
      this.passwordStrength.strength = this.passwordRules.getStrength(password);
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
