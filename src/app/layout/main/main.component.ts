import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TopBarAction} from "../../models/TopBarAction";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  actions: TopBarAction[] = [];
  backAction: TopBarAction | null = null;
  private actionsSubscription = new Subscription();
  private backActionSubscription = new Subscription();

  constructor(public authService: AuthService, private actionsService: TopBarActionsService) {
  }

  ngOnInit(): void {
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => this.actions = actions);
    this.backActionSubscription = this.actionsService.backAction
      .subscribe(s => this.backAction = s);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.backActionSubscription.unsubscribe();
  }
}
