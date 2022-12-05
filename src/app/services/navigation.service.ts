import {Injectable, OnDestroy} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {Subject, Subscription} from "rxjs";
import {Action} from "../models/action";

@Injectable()
export class NavigationService implements OnDestroy {
  private _afterNavigated = new Subject<any>();
  private _actions = new Subject<Action[]>();

  private routerEventSubscriptions: Subscription;

  constructor(private readonly router: Router) {
    this.routerEventSubscriptions = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._afterNavigated.next(event.url);
      }
    });
  }

  ngOnDestroy(): void {
    this._afterNavigated.complete();
    this._actions.complete();
    this.routerEventSubscriptions.unsubscribe();
  }

  afterNavigated(onNext: (navigationData: any) => Action[] | null): Subscription {
    return this._afterNavigated.subscribe(url => {
      const actions = onNext(url);
      if (actions) {
        this._actions.next(actions);
      }
    });
  }

  actionsChanged(onNext: (actions: Action[]) => void): Subscription {
    return this._actions.subscribe(onNext);
  }
}
