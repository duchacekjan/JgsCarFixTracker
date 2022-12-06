import {Injectable, OnDestroy} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {Action} from "../models/action";

export class ActionsData {
  backAction: Action | null = null;
  actions: Action[] = [];
  isMenuAvailable: boolean = true;
  isSettingsVisible: boolean = true;

  static createBackAction(route: string): Action {
    const result = new Action('arrow_back');
    result.route = route ?? '';
    result.tooltip = 'toolbar.back'
    return result;
  }
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService implements OnDestroy {
  private _afterNavigated = new Subject<any>();
  private _actionsData = new Subject<ActionsData>();
  private _currentNavigationData: any;

  private routerEventSubscriptions: Subscription;

  constructor(
    private readonly router: Router) {
    console.log('nav-svc');
    this.routerEventSubscriptions = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log(`navigated ${event.url}`);
        this._currentNavigationData = event.url;
        this._afterNavigated.next(event.url);
      }
    });
  }

  get currentNavigationData(): any {
    return this._currentNavigationData;
  }

  updateActionsData(value: ActionsData) {
    this._actionsData.next(value);
  }

  ngOnDestroy(): void {
    this._afterNavigated.complete();
    this._actionsData.complete();
    this.routerEventSubscriptions.unsubscribe();
  }

  afterNavigated(onNext: (navigationData: any) => void): Subscription {
    return this._afterNavigated.subscribe(onNext);
  }

  actionsDataChanged(onNext: (actionsData: ActionsData) => void): Subscription {
    return this._actionsData.subscribe(onNext);
  }
}
