import {Injectable} from '@angular/core';
import {FormGroup, FormGroupDirective} from "@angular/forms";

class PasswordRule {
  private readonly _matcher: (text: string) => boolean;
  private readonly _constant: number;
  private _count: number = 0;
  private _value: number = 0;

  constructor(matcher: (text: string) => boolean, constant: number = 5) {
    this._matcher = matcher;
    this._constant = constant;
  }

  get count(): number {
    return this._count;
  }

  get value(): number {
    return this._value;
  }

  validate(text: string) {
    this._count = this._matcher(text) ? 1 : 0;
    this._value = this._count * this._constant;
  }
}

export enum PasswordStrength {
  Weak,
  Moderate,
  Strong
}

export class PasswordRules {
  private readonly _rules: PasswordRule[] = [
    new PasswordRule(s => s.length >= 8, 10),
    new PasswordRule(s => !!s.match('[a-z]')),
    new PasswordRule(s => !!s.match('[A-Z]')),
    new PasswordRule(s => !!s.match('\\d')),
    new PasswordRule(s => !!s.match('\\W'), 10),
    new PasswordRule(s => !!s.match('(?:(.)(?!.*?\\1).*){6}'))
  ];

  constructor() {
  }

  getStrength(password: string): PasswordStrength {
    const score = this.getScore(password);
    return score <= 35 ? PasswordStrength.Weak
      : score <= 70 ? PasswordStrength.Moderate
        : PasswordStrength.Strong;
  }

  getScore(password: string): number {
    this._rules.forEach(item => {
      item.validate(password);
    });
    const coefficient = this._rules.reduce((sum, current) => sum + current.count, 0) * 10;
    const sum = this._rules.reduce((sum, current) => sum + current.value, 0);
    return sum + coefficient;
  }
}

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
