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
  private internalBackAction = new TopBarAction('arrow_back');

  clear() {
    this.internalActions = [];
    this.backAction.next(null);
    this.updateActions();
  }

  add(action: TopBarAction) {
    this.internalActions.push(action);
    this.updateActions();
  }

  showBackAction(backRoute: string | null = null) {
    this.internalBackAction.route = backRoute
      ? backRoute
      : '/cars';
    this.backAction.next(this.internalBackAction);
  }

  private updateActions() {
    this.actions.next(this.internalActions);
  }
}
