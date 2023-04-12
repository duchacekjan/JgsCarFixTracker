import {debounceTime, distinctUntilChanged, filter, OperatorFunction, pipe, startWith} from "rxjs";
import {FormGroup, FormGroupDirective} from "@angular/forms";

const DEFAULT_DEBOUNCE = 300;
const DEFAULT_LENGTH = 1;

export interface SearchOptions {
  minLength?: number
  debounceTime?: number
}

export interface SearchTextOptions {
  accentInsensitive: boolean
  caseInsensitive: boolean
}

export function search(options: SearchOptions = {}): OperatorFunction<string | null, any> {
  return pipe(
    startWith(''),
    debounceTime(options.debounceTime || DEFAULT_DEBOUNCE),
    distinctUntilChanged(),
    filter(x => !x || false || x.length >= (options.minLength || DEFAULT_LENGTH))
  );
}

export function searchText(targetText: string, searchedText: string, options: SearchTextOptions = {
  accentInsensitive: true,
  caseInsensitive: true
}): boolean {
  let searchValue = setCaseInsensitivity(searchedText, options.caseInsensitive);
  let targetValue = setCaseInsensitivity(targetText, options.caseInsensitive);
  searchValue = setAccentInsensitivity(searchValue, options.caseInsensitive);
  targetValue = setAccentInsensitivity(targetValue, options.caseInsensitive);
  return targetValue.includes(searchValue);
}

export function formatDate(date: any): string | null {
  if (date == null) {
    return null;
  }
  const d = new Date(date);
  let month = '' + padTo2Digits(d.getMonth() + 1);
  let day = '' + padTo2Digits(d.getDate());
  const year = d.getFullYear();
  return [year, month, day].join('-');
}

export function formatTime(date: Date) {
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes())
  ].join(':')
}

export function formatNotificationDate(date: Date) {
  let parts = [
    padTo2Digits(date.getDate()),
    padTo2Digits(date.getMonth() + 1)
  ];
  const year = date.getFullYear();
  if (year < (new Date()).getFullYear()) {
    parts.push(year.toString())
  } else {
    parts.push('')
  }
  return parts.join('.')
}

export function insertBase(original: string, selStart: number, selEnd: number, tag: string, defaultSelection: string = '', attributes: string[] = []): string {
  let selection = original.slice(selStart, selEnd);
  console.log(selection)
  if (selection.length == 0) {
    selection = defaultSelection;
  }
  const tagAttributes = attributes.length == 0 ? '' : ` ${attributes.join(' ')}`;
  const startTag = `<${tag}${tagAttributes}>`;
  const endTag = `</${tag}>`;
  return original.slice(0, selStart) +
    startTag + selection + endTag +
    original.slice(selEnd);
}

export function resetForm(form: FormGroup, formGroup?: FormGroupDirective, customResetAction?: () => {}) {
  if (customResetAction) {
    customResetAction();
  }
  form.reset();
  form.setErrors(null);
  form.updateValueAndValidity();
  formGroup?.resetForm();
}

export function resetFormGroup(formGroup?: FormGroupDirective, customResetAction?: () => {}) {
  if (customResetAction) {
    customResetAction();
  }
  let form = formGroup?.form;
  form?.reset();
  form?.setErrors(null);
  form?.updateValueAndValidity();
  formGroup?.resetForm();
}

function setCaseInsensitivity(text: string, caseInsensitive: boolean): string {
  return caseInsensitive ? text.toLowerCase() : text;
}

function setAccentInsensitivity(text: string, accentInsensitive: boolean): string {
  return accentInsensitive ? text.normalize('NFD').replace(/\p{Diacritic}/gu, "") : text;
}

function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}
