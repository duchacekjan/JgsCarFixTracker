import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {TopBarAction} from "../models/TopBarAction";

@Injectable({
  providedIn: 'root'
})
export class TopBarActionsService {

  backAction = new Subject<TopBarAction | null>()
  actions = new Subject<TopBarAction[]>;
  private internalActions: TopBarAction[] = [];
  private backRoute: string | null = null;

  clear() {
    this.internalActions = [];
    this.backRoute = null;
  }

  add(action: TopBarAction, ...actions: TopBarAction[]) {
    this.internalActions.push(action);
    actions.forEach(item => this.internalActions.push(item));
  }

  setBackActionRoute(backRoute: string | null = null) {
    this.backRoute = backRoute
      ? backRoute
      : '/cars';
  }

  updateActions() {
    this.actions.next(this.internalActions);
    let action: TopBarAction | null = null;
    if (this.backRoute != null) {
      action = new TopBarAction('arrow_back');
      action.route = this.backRoute
      this.backAction.next(action);
    }
  }
}
