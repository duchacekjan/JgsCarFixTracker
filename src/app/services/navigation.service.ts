import {Injectable, OnDestroy} from "@angular/core";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {Action} from "../models/action";
import {TranslateService} from "@ngx-translate/core";

export interface IMenuSettings {
  isAuthorized: boolean,
  isSettingsVisible: boolean,
  isNotificationsVisible: boolean
}

export class ActionsData {
  backAction: Action | null = null;
  actions: Action[] = [];
  isMenuAvailable: boolean = true;
  isSettingsVisible: boolean = true;
  isNotificationsVisible: boolean = true;
  static readonly homeRoute = '/home';

  getMenuSettings(isAuthorized: boolean): IMenuSettings | undefined {
    return this.isMenuAvailable
      ? {
        isAuthorized: isAuthorized,
        isSettingsVisible: this.isSettingsVisible,
        isNotificationsVisible: this.isNotificationsVisible
      }
      : undefined;
  }

  getCurrentBackAction(isMenuActive: boolean): Action | null {
    if (this.backAction == null) {
      return null;
    }
    if (this.backAction.route == ActionsData.homeRoute && !isMenuActive) {
      return null;
    }
    return this.backAction;
  }

  static createBackAction(route: string, isMenuActive: boolean = true): Action {
    if (route == this.homeRoute) {
      return this.createHomeAction();
    }

    if (isMenuActive && route == '/') {
      return this.createHomeAction();
    }
    const result = new Action('arrow_back');
    result.route = route ?? '';
    result.tooltip = 'toolbar.back'
    return result;
  }

  private static createHomeAction(): Action {
    const result = new Action('home');
    result.route = this.homeRoute;
    result.tooltip = 'toolbar.home'
    return result;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy {
  private _actionsData = new Subject<ActionsData>();
  private _currentNavigationData: any;

  private routerEventSubscription: Subscription;

  constructor(
    private readonly translate: TranslateService,
    public readonly router: Router) {
    translate.setDefaultLang('cs');
    translate.use('cs');
    this.routerEventSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._currentNavigationData = event.url;
      }
    });
  }

  get currentNavigationData(): any {
    return this._currentNavigationData;
  }

  navigateWithoutHistory(path: string, route: ActivatedRoute, queryParams: Params) {
    return this.router.navigate([path], {replaceUrl: true, relativeTo: route, queryParams: queryParams});
  }

  updateActionsData(value: ActionsData) {
    this._actionsData.next(value);
  }

  ngOnDestroy(): void {
    this._actionsData.complete();
    this.routerEventSubscription.unsubscribe();
  }

  actionsDataChanged(onNext: (actionsData: ActionsData) => void): Subscription {
    return this._actionsData.subscribe(onNext);
  }
}
