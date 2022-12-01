import {Injectable, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {OverlayContainer} from "@angular/cdk/overlay";
import {Subject} from "rxjs";

@Injectable()
export class SettingsService implements OnDestroy{
  modeChanged = new Subject<ThemeMode>();
  private isDarkModePreferred = false;
  private _themeMode = ThemeMode.Auto;

  private readonly THEME_MODE = 'THEME_MODE';

  constructor() {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkModePreferred = query.matches;
    query.addEventListener("change", a => {
      this.isDarkModePreferred = a.matches
    });
    this.themeMode = this.getLocalStoredMode();
  }

  ngOnDestroy(): void {
    this.modeChanged.complete();
  }

  set themeMode(mode: ThemeMode) {
    localStorage.setItem(this.THEME_MODE, JSON.stringify(mode));
    this._themeMode = mode;
    this.modeChanged.next(mode);
  }

  get themeMode(): ThemeMode {
    return this._themeMode;
  }

  get isDarkMode(): boolean {
    return this._themeMode === ThemeMode.Dark || (this._themeMode === ThemeMode.Auto && this.isDarkModePreferred);
  }

  private getLocalStoredMode(): ThemeMode {
    return JSON.parse(localStorage.getItem(this.THEME_MODE) ?? JSON.stringify(ThemeMode.Auto));
  }
}

export enum ThemeMode {
  Auto = 'Auto',
  Light = 'Light',
  Dark = 'Dark'
}
