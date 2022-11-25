import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {TopBarAction} from "../../models/TopBarAction";
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  actions: TopBarAction[] = [];
  backAction = false;
  isLoggedIn = false;

  private actionsSubscription = new Subscription();
  private backActionSubscription = new Subscription();
  private authUserSubscription = new Subscription();

  constructor(
    public authService: AuthService,
    private actionsService: TopBarActionsService,
    private userService: UsersService) {
  }

  ngOnInit(): void {
    this.authUserSubscription = this.userService.isLoggedIn.subscribe(s => this.isLoggedIn = s);
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => this.actions = actions);
    this.backActionSubscription = this.actionsService.backAction
      .subscribe(s => this.backAction = s);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.backActionSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
  }
}
