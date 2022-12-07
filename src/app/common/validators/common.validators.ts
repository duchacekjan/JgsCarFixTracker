import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {PasswordService, PasswordStrength} from "../../services/password.service";

export class CommonValidators {
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

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    let hasError = false;
    if (control && control.value) {
      const passwordRules = new PasswordService();
      const strength = passwordRules.getStrength(control.value);
      hasError = strength < PasswordStrength.Moderate;
    }
    return hasError
      ? {weakpassword: true}
      : null;
  }

  static firebaseEmail(control: AbstractControl): ValidationErrors | null {
    //Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
    let hasError = false;
    if (control && control.value) {
      hasError = control.value.match('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') === null;
    }
    return hasError
      ? {email: true}
      : null;
  }
}
