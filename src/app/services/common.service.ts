import {Injectable} from '@angular/core';
import {FormGroup, FormGroupDirective} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() {
  }

  resetForm(form: FormGroup, formGroup?: FormGroupDirective, customResetAction?: () => {}) {
    if (customResetAction) {
      customResetAction();
    }
    form.reset();
    form.setErrors(null);
    form.updateValueAndValidity();
    formGroup?.resetForm();
  }
}
