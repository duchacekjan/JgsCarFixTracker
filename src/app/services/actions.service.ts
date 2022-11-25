import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {Action} from "../models/action";

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  backAction = new Subject<boolean>()
  actions = new Subject<Action[]>;
  private internalActions: Action[] = [];
  private isBackActionVisible = false;
  private currentBackActionVisibility = false;

  clear() {
    this.internalActions = [];
    this.isBackActionVisible = false;
  }

  add(action: Action, ...actions: Action[]) {
    this.internalActions.push(action);
    actions.forEach(item => this.internalActions.push(item));
  }

  showBackAction() {
    this.isBackActionVisible = true;
  }

  updateActions() {
    this.actions.next(this.internalActions);
    if (this.currentBackActionVisibility != this.isBackActionVisible) {
      this.currentBackActionVisibility = this.isBackActionVisible;
      this.backAction.next(this.currentBackActionVisibility);
    }
  }
}
