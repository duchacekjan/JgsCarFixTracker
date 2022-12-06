import {Component, OnDestroy, Renderer2} from '@angular/core';
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
export class LayoutComponent extends BaseAfterNavigatedHandler implements OnDestroy {
  actionsData = new ActionsData();
  isLogoutVisible = false;
  version: string;
  user: User | null = null;
  private actionsSubscription: Subscription;
  private authUserSubscription: Subscription;
  private themeModeSubscription: Subscription;

  constructor(
    private readonly authService: AuthService,
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
    this.themeModeSubscription = this.settingsService.themeChangedSubscription(() => this.updateThemeMode());
    this.updateThemeMode()
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.authUserSubscription.unsubscribe();
    this.themeModeSubscription.unsubscribe();
  }

  async backClick() {
    if (this.actionsData.backAction != null) {
      await this.router.navigate([this.actionsData.backAction.route], {queryParams: this.actionsData.backAction.queryParams, replaceUrl: true, relativeTo: this.route})
    }
  }

  signOut() {
    this.authService.signOut()
      .then(async () => {
        await this.router.navigate(['auth/sign-in'], {replaceUrl: true});
      });
  }

  protected override afterNavigated(data: any) {
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
}
