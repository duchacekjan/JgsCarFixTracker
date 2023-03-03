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

export function search(options: SearchOptions = {}): OperatorFunction<string, any> {
  return pipe(
    startWith(''),
    debounceTime(options.debounceTime || DEFAULT_DEBOUNCE),
    distinctUntilChanged(),
    filter(x => !x || x.length >= (options.minLength || DEFAULT_LENGTH))
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

function setCaseInsensitivity(text: string, caseInsensitive: boolean): string {
  return caseInsensitive ? text.toLowerCase() : text;
}

function setAccentInsensitivity(text: string, accentInsensitive: boolean): string {
  return accentInsensitive ? text.normalize('NFD').replace(/\p{Diacritic}/gu, "") : text;
}
