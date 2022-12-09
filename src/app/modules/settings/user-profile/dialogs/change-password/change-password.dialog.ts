import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData, IDialogAction} from "../../../../../common/dialog/dialog.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonValidators} from "../../../../../common/validators/common.validators";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password.dialog.html',
  styleUrls: ['./change-password.dialog.scss']
})
export class ChangePasswordDialog {
  showPassword: boolean = false;
  showNewPassword: boolean = false;
  password = new FormControl('', [Validators.required]);
  newPassword = new FormControl('', [Validators.required, CommonValidators.strongPassword, Validators.minLength(6)]);

  form = new FormGroup({
    password: this.password,
    newPassword: this.newPassword
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.password.patchValue(data.extraData.password);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  getDisabled(action: IDialogAction): boolean {
    return action.getDisabled
      ? action.getDisabled(!this.form.valid)
      : false;
  }
}
