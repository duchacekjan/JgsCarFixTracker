import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {Subscription} from "rxjs";
import {Q} from "@angular/cdk/keycodes";
import {OverlayContainer} from "@angular/cdk/overlay";

@Component({
  selector: 'app-user-detail',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settingsForm = new FormGroup({
    themeMode: new FormControl(ThemeMode.Auto)
  })

  private changesSubscription!: Subscription;
  private isDarkModePreferred = false;

  private readonly THEME_MODE = 'THEME_MODE';
  private _ignoreChanges = false;

  constructor(
    private actionsService: TopBarActionsService,
    private renderer: Renderer2,
    private overlay: OverlayContainer) { }

  ngOnInit(): void {
    this.changesSubscription = this.settingsForm.valueChanges
      .subscribe(formValue => {
        this._ignoreChanges = true;
        this.themeMode = formValue.themeMode ?? ThemeMode.Auto;
      });
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkModePreferred = query.matches;
    query.addEventListener("change", a => {
      this.isDarkModePreferred = a.matches
    });
    this.themeMode = this.getLocalStoredMode();

    this.actionsService.clear();
    this.actionsService.showBackAction();
    this.actionsService.updateActions();
  }

  ngOnDestroy(): void {
    this.changesSubscription.unsubscribe();
  }

  private set themeMode(mode: ThemeMode) {
    const darkClassName = 'darkMode';
    if (this.useDarkMode(mode)) {
      this.renderer.addClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.renderer.removeClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }

    localStorage.setItem(this.THEME_MODE, JSON.stringify(mode));
    if (!this._ignoreChanges) {
      let control = this.settingsForm.get('themeMode');
      if (control) {
        control.patchValue(mode);
      }
    } else {
      this._ignoreChanges = false;
    }
  }

  private useDarkMode(mode: ThemeMode): boolean {
    return mode === ThemeMode.Dark || (mode === ThemeMode.Auto && this.isDarkModePreferred);
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
