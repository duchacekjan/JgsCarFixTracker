import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export class CustomValidators {
  static formMismatchPassword(passwordControlName: string, confirmPasswordControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let password = control.get(passwordControlName);
      let confirmPassword = control.get(confirmPasswordControlName);
      const hasError = password && confirmPassword && password.valid && confirmPassword.value !== password.value;
      const result = hasError
        ? {mismatchedpassword: true}
        : null;
      confirmPassword?.setErrors(result);
      return result;
    }
  }
}
