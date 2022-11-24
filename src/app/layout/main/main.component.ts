import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TopBarAction} from "../../models/TopBarAction";
import {OverlayContainer} from "@angular/cdk/overlay";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  actions: TopBarAction[] = [];
  backAction = false;

  private actionsSubscription = new Subscription();
  private backActionSubscription = new Subscription();
  private _isDarkMode = false;
  private readonly THEME_MODE = 'THEME_MODE';
  private _isDarkModePreferred = false;

  constructor(
    public authService: AuthService,
    private actionsService: TopBarActionsService,
    private overlay: OverlayContainer,
    private renderer: Renderer2,
    private readonly translate: TranslateService) {
  }

  ngOnInit(): void {
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => this.actions = actions);
    this.backActionSubscription = this.actionsService.backAction
      .subscribe(s => this.backAction = s);
    this._isDarkModePreferred = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const savedMode = localStorage.getItem(this.THEME_MODE);
    this.isDarkMode = savedMode ? JSON.parse(savedMode) : this._isDarkModePreferred;
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.backActionSubscription.unsubscribe();
  }

  set isDarkMode(value: boolean) {
    this._isDarkMode = value;
    const darkClassName = 'darkMode';
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.renderer.removeClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }

    if (this._isDarkModePreferred !== this._isDarkMode) {
      localStorage.setItem(this.THEME_MODE, JSON.stringify(this._isDarkMode));
    }
  }

  get isDarkMode() {
    return this._isDarkMode;
  }
}
