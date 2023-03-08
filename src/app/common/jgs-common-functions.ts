import {debounceTime, distinctUntilChanged, filter, OperatorFunction, pipe, startWith} from "rxjs";

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

export function formatDate(date: any) {
  const d = new Date(date);
  let month = '' + padTo2Digits(d.getMonth() + 1);
  let day = '' + padTo2Digits(d.getDate());
  const year = d.getFullYear();
  return [year, month, day].join('-');
}

export function formatTime(date: Date) {
  const d = new Date(date);
  return [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes())
  ].join(':')
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
