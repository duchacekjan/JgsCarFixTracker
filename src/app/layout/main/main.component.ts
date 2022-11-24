import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TopBarAction} from "../../models/TopBarAction";
import {OverlayContainer} from "@angular/cdk/overlay";

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

  constructor(public authService: AuthService, private actionsService: TopBarActionsService, private overlay: OverlayContainer, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => this.actions = actions);
    this.backActionSubscription = this.actionsService.backAction
      .subscribe(s => this.backAction = s);
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    console.log(query.matches);
    this.isDarkMode = query.matches;
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
  }

  get isDarkMode() {
    return this._isDarkMode;
  }
}
