import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {User} from "@angular/fire/auth/firebase";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {SettingsService} from "../../services/settings.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionsData, NavigationService} from "../../services/navigation.service";
import {environment} from "../../../environments/environment";
import {BaseAfterNavigatedHandler} from "../BaseAfterNavigatedHandler";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent extends BaseAfterNavigatedHandler implements OnInit, OnDestroy {
  actionsData = new ActionsData();
  isSettingsVisible = true;
  isLogoutVisible = false;
  version: string;
  user: User | null = null;
  private actionsSubscription: Subscription;
// private backActionSubscription = new Subscription();
  private authUserSubscription: Subscription;
  private themeModeSubscription: Subscription;
// private queryParamsSubscription = new Subscription();

  private backLink = '/cars';

  constructor(
    private readonly authService: AuthService,
    // private actionsService: ActionsService,
    // private userService: UsersService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private overlay: OverlayContainer,
    private readonly router: Router,
    private route: ActivatedRoute,
    navigation: NavigationService) {
    super(navigation);
    this.version = environment.appVersion;
    this.authUserSubscription = this.authService.currentUserChanged(user => this.setUser(user));
    this.actionsSubscription = this.navigation.actionsDataChanged(actionsData => this.setActions(actionsData));
    this.themeModeSubscription = this.settingsService.modeChanged.subscribe(() => this.updateThemeMode());
    this.updateThemeMode()
  }

  ngOnInit(): void {
    // this.authUserSubscription = this.userService.isLoggedIn.subscribe(s => {
    //   this.isLoggedIn = s
    //   this.user = this.userService.currentUser;
    // });
    // this.queryParamsSubscription = this.route.queryParamMap.subscribe(map => this.processQueryParamMap(map))
    // this.actionsSubscription = this.actionsService.actions
    //   .subscribe(actions => this.actions = actions);
    // this.backActionSubscription = this.actionsService.backAction
    //   .subscribe(s => this.backAction = s);
    // this.updateThemeMode();
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    // this.queryParamsSubscription.unsubscribe();
    // this.backActionSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.themeModeSubscription.unsubscribe();
  }

  backClick() {
    // const parts = this.backLink.split('?');
    // const url = parts[0];
    // let queryParams: any = {};
    // if (parts.length > 1) {
    //   const queryParameters = decodeURIComponent(parts[1])
    //   for (let param of queryParameters.split('&')) {
    //     const paramParts = param.split('=');
    //     queryParams[paramParts[0]] = paramParts.length > 1 ? paramParts[1] : '';
    //   }
    // }
    //
    // this.router.navigate([url], {queryParams: queryParams}).catch();
  }

  signOut() {
    this.authService.signOut()
      .then(async () => {
        await this.router.navigate(['auth/sign-in'], {replaceUrl: true});
      });
  }

  protected override afterNavigated(data: any) {
    setTimeout(() => {
      this.isSettingsVisible = data?.startsWith('/settings');
    }, 0);
    this.authService.getCurrentUser()
      .then(user => this.setUser(user));
  }

  private setUser(user: any) {

    this.user = user;
    setTimeout(() => {
      this.isLogoutVisible = user?.emailVerified == true;
    }, 0);
  }

  private setActions(actionsData: ActionsData) {
    setTimeout(() => {
      this.actionsData = actionsData
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

// private processQueryParamMap(map: ParamMap) {
//     this.backLink = map.get('backLink') ?? '/cars';
//   }
}
