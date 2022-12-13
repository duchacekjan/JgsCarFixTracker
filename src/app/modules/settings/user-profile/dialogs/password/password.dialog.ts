import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData, IDialogAction} from "../../../../../common/dialog/dialog.model";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password.dialog.html',
  styleUrls: ['./password.dialog.scss']
})
export class PasswordDialog {
  showPassword: boolean = false;
  password = new FormControl('', [Validators.required]);

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.password.patchValue(data.extraData.password);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getDisabled(action: IDialogAction): boolean {
    return action.getDisabled
      ? action.getDisabled(!this.password.valid)
      : false;
  }
}
