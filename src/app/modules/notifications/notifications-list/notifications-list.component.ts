import {Component, OnDestroy} from '@angular/core';
import {AfterNavigatedHandler} from "../../../common/base/after-navigated-handler";
import {ActivatedRoute} from "@angular/router";
import {ActionsData, NavigationService} from "../../../services/navigation.service";
import {AuthService} from "../../../services/auth.service";
import {Observable, of, Subscription} from "rxjs";
import {JgsNotification} from "../../../models/INotification";
import {NotificationsService} from "../../../services/notifications.service";

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent extends AfterNavigatedHandler implements OnDestroy {
  notifications: Observable<JgsNotification[]> = of([]);
  private userId?: string;

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationsService,
    route: ActivatedRoute,
    navigationService: NavigationService) {
    super(route, navigationService);
  }

  ngOnDestroy(): void {
  }

  protected override getActionsData(): ActionsData {
    const result = super.getActionsData();
    result.isNotificationsVisible = false;
    return result;
  }

  protected override afterNavigationEnded() {
    this.authService.getCurrentUser()
      .then(user => this.setUserId(user));
  }

  private setUserId(userId?: string) {
    this.userId = userId;
    setTimeout(() => {
      this.notifications = this.notificationService.getList(this.userId);
    }, 0);
  }

  test() {
    this.notificationService.create("TEST", "ZPRE");
  }
}
