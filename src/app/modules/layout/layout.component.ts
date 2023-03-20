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
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('liveNotificationExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class LayoutComponent extends AfterNavigatedHandler implements OnDestroy {
  isDebug: boolean = !environment.production
  actionsData: ActionsData | null = null;
  menuSettings?: IMenuSettings;
  version: string;
  user: User | null = null;
  notificationsCount: number = 0;
  notifications: JgsNotification[] = [];
  private actionsSubscription: Subscription;
  private authUserSubscription: Subscription;
  private themeModeSubscription: Subscription;
  private notificationsSubscription = new Subscription();
  private isFirstCall: boolean = false;
  private _liveNotification?: JgsNotification;
  private readonly liveNotifications: Array<JgsNotification> = [];

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

  get liveNotification(): JgsNotification | undefined {
    return this._liveNotification;
  }

  set liveNotification(value: JgsNotification | undefined) {
    this._liveNotification = value;
    if (value != undefined) {
      setTimeout(() => {
        this.setNextLiveNotification();
      }, 4000)
    }
  }

  get liveSubject(): string {
    return !this.liveNotification ? '' : this.liveNotification.data.subject + ':'
  }

  get liveBody(): string {
    return !this.liveNotification ? '' : this.liveNotification.data.body
  }

  get liveQueryParams() {
    return !this.liveNotification ? {} : {key: this.liveNotification.data.key}
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.themeModeSubscription.unsubscribe();
    this.notificationsSubscription.unsubscribe();
  }

  async backClick() {
    if (this.actionsData?.backAction != null) {
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
    console.log(this.route.snapshot.url.toString())
    this.authService.getCurrentUser()
      .then(user => this.setUser(user));
  }

  protected override getActionsData(): ActionsData | null {
    return this.actionsData;
  }

  private setUser(user: any) {
    if (this.user != user) {
      this.isFirstCall = true;
    }
    this.user = user;
    setTimeout(() => {
      if (this.menuSettings) {
        this.menuSettings = this.actionsData?.getMenuSettings(this.user != null);
      }
      this.notificationsSubscription.unsubscribe();
      this.notifications = [];
      this.notificationsCount = 0;
      if (this.user != null && this.menuSettings?.isNotificationsVisible === true) {
        this.notificationsSubscription = this.notificationsService.getList(this.user?.uid ?? '').subscribe(data => {
          this.updateNotifications(data);
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

  private updateNotifications(data: JgsNotification[]) {
    if (this.isFirstCall) {
      this.isFirstCall = false;
    } else {
      const newNotifications = data
        .filter(f => !this.notifications.find(n => n.data.key == f.data.key))
        .filter(n => !n.isRead)
        .sort((a, b) => a.data.created > b.data.created ? 1 : a.data.created < b.data.created ? -1 : 0);
      if (newNotifications.length == 1) {
        if (this.liveNotification != undefined) {
          this.liveNotifications.push(newNotifications[0])
        } else {
          this.liveNotification = newNotifications[0];
        }
      }
    }
    this.notifications = data;
    this.notificationsCount = this.notifications.filter(n => !n.isRead).length;
  }

  dismissLiveNotification() {
    this.liveNotification = undefined
  }

  private setNextLiveNotification() {
    if (this.liveNotifications.length > 0) {
      setTimeout(() => {
        this.liveNotification = this.liveNotifications.shift();
      }, 300);
    }
    this.liveNotification = undefined;
  }
}
