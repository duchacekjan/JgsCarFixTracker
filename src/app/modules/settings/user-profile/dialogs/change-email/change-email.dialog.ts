import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DialogData, IDialogAction} from "../../../../../common/dialog/dialog.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CommonValidators} from "../../../../../common/validators/common.validators";

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email.dialog.html',
  styleUrls: ['./change-email.dialog.scss']
})
export class ChangeEmailDialog {
  password = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, CommonValidators.firebaseEmail]);

  form = new FormGroup({
    password: this.password,
    email: this.email
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  getDisabled(action: IDialogAction): boolean {
    return action.getDisabled
      ? action.getDisabled(!this.form.valid)
      : false;
  }
}
