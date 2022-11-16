import {Component, OnDestroy, OnInit} from '@angular/core';
import {TopBarActionsService} from "../../services/top-bar-actions.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {Location} from "@angular/common";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  actions: any[] = [];
  isBackButtonVisible: boolean = false;
  private actionsSubscription = new Subscription();

  constructor(public authService: AuthService, private actionsService: TopBarActionsService) {
  }

  ngOnInit(): void {
    this.actionsSubscription = this.actionsService.actions
      .subscribe(actions => {
        this.actions = actions;
      });
    this.actionsService.isBackActionVisible.subscribe(s => this.isBackButtonVisible = s);
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
  }
}
