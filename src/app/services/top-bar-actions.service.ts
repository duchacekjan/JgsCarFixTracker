import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {TopBarAction} from "../models/TopBarAction";

@Injectable({
  providedIn: 'root'
})
export class TopBarActionsService {

  backAction = new Subject<boolean>()
  actions = new Subject<TopBarAction[]>;
  private internalActions: TopBarAction[] = [];
  private isBackActionVisible = false;

  clear() {
    this.internalActions = [];
    this.isBackActionVisible = false;
  }

  add(action: TopBarAction, ...actions: TopBarAction[]) {
    this.internalActions.push(action);
    actions.forEach(item => this.internalActions.push(item));
  }

  showBackAction() {
    this.isBackActionVisible = true;
  }

  updateActions() {
    this.actions.next(this.internalActions);
    this.backAction.next(this.isBackActionVisible);
  }
}
