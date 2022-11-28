import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AuthService} from "../../../../services/auth.service";
import {Subscription} from "rxjs";
import {CommonService} from "../../../../services/common.service";
import {CustomValidators} from "../../../../common/CustomValidators";

@Component({
  selector: 'app-confirm-reset-password',
  templateUrl: './confirm-reset-password.component.html',
  styleUrls: ['./confirm-reset-password.component.scss']
})
export class ConfirmResetPasswordComponent implements OnInit, OnDestroy {

  form = new FormGroup({
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl(null, {
        updateOn: 'change' || 'blur' || 'submit',
        validators: [Validators.required]
      })
    },
    [CustomValidators.formMismatchPassword('password', 'confirmPassword')])
  @ViewChild(FormGroupDirective, {static: true}) formGroup!: FormGroupDirective;

  private queryParamMapSubscription = new Subscription();
  private oobCode = '';

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private commonService: CommonService) {
    this.queryParamMapSubscription = this.route.queryParamMap.subscribe(map => this.processQueryParamMap(map));
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
}
