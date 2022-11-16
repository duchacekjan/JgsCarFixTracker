import {Injectable} from '@angular/core';
import {Observable, of, Subject} from "rxjs";
import {TopBarAction} from "../models/TopBarAction";

@Injectable({
  providedIn: 'root'
})
export class TopBarActionsService {

  isBackActionVisible = new Subject<boolean>()
  actions = new Subject<TopBarAction[]>;
  private internalActions: TopBarAction[] = [];

  clear() {
    this.internalActions = [];
    this.isBackActionVisible.next(false);
    this.updateActions();
  }

  add(action: any) {
    this.internalActions.push(action);
    this.updateActions();
  }

  showBackAction() {
    this.isBackActionVisible.next(true);
  }

  private updateActions() {
    this.actions.next(this.internalActions);
  }
}
