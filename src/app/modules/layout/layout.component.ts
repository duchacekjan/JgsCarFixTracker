import {Component, OnDestroy, Renderer2} from '@angular/core';
import {User} from "@angular/fire/auth/firebase";
import {Subscription} from "rxjs";
import {OverlayContainer} from "@angular/cdk/overlay";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionsData, IMenuSettings, NavigationService} from "../../services/navigation.service";
import {AuthService} from "../../services/auth.service";
import {SettingsService} from "../../services/settings.service";
import {environment} from "../../../environments/environment";
import {AfterNavigatedHandler} from "../../common/base/after-navigated-handler";
import {JgsAppTitleStrategy} from "../../common/jgs-app-title.strategy";
import {JgsNotification} from "../../models/INotification";
import {NotificationsService} from "../../services/notifications.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends AfterNavigatedHandler implements OnDestroy {
  actionsData = new ActionsData();
  menuSettings?: IMenuSettings;
  version: string;
  user: User | null = null;
  notificationsCount: number = 0;
  notifications: JgsNotification[] = [];
  private actionsSubscription: Subscription;
  private authUserSubscription: Subscription;
  private themeModeSubscription: Subscription;
  private notificationsSubscription = new Subscription();

  constructor(
    private readonly authService: AuthService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private overlay: OverlayContainer,
    private readonly router: Router,
    public readonly title: JgsAppTitleStrategy,
    private readonly notificationsService: NotificationsService,
    route: ActivatedRoute,
    navigation: NavigationService) {
    super(route, navigation);
    this.version = environment.appVersion;
    this.authUserSubscription = this.authService.currentUserChanged(user => this.setUser(user));
    this.actionsSubscription = this.navigation.actionsDataChanged(actionsData => this.setActions(actionsData));
    this.themeModeSubscription = this.settingsService.themeChangedSubscription(() => this.updateThemeMode());
    this.updateThemeMode();
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.themeModeSubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
  }

  async backClick() {
    if (this.actionsData.backAction != null) {
      await this.router.navigate([this.actionsData.backAction.route], {queryParams: this.actionsData.backAction.queryParams, replaceUrl: true, relativeTo: this.route})
    }
  }

  signOut() {
    this.notificationsSubscription.unsubscribe();
    this.notifications = [];
    this.notificationsCount = 0;
    this.authService.signOut()
      .then(() => this.router.navigate(['auth/sign-in'], {replaceUrl: true}));
  }

  protected override afterNavigationEnded() {
    this.authService.getCurrentUser()
      .then(user => this.setUser(user));
  }

  private setUser(user: any) {
    this.user = user;
    setTimeout(() => {
      if (this.menuSettings) {
        let menuSettings = this.menuSettings;
        menuSettings.isAuthorized = this.user != null;
        menuSettings.isNotificationsVisible = menuSettings.isAuthorized && menuSettings.isNotificationsVisible;
        this.menuSettings = {
          isAuthorized: menuSettings.isAuthorized,
          isSettingsVisible: menuSettings.isSettingsVisible,
          isNotificationsVisible: menuSettings.isNotificationsVisible
        }
      }
      this.notificationsSubscription.unsubscribe();
      this.notifications = [];
      this.notificationsCount = 0;
      if (this.user != null && this.menuSettings?.isNotificationsVisible === true) {
        this.notificationsSubscription = this.notificationsService.getList(this.user?.uid ?? '').subscribe(data => {
          this.notifications = data;
          this.notificationsCount = this.notifications.filter(n => !n.isRead).length;
        });
      }

    }, 0);
  }

  private setActions(actionsData: ActionsData) {
    setTimeout(() => {
      this.actionsData = actionsData
      this.menuSettings = actionsData.getMenuSettings(this.user !== null);
    }, 0);
  }

  private updateThemeMode() {
    const darkClassName = 'darkMode';
    if (this.settingsService.isDarkMode) {
      this.renderer.addClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.add(darkClassName);
    } else {
      this.renderer.removeClass(document.body, darkClassName);
      this.overlay.getContainerElement().classList.remove(darkClassName);
    }
  }
}
