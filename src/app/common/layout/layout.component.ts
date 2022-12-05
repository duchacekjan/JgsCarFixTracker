import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Action} from "../../models/action";
import {User} from "@angular/fire/auth/firebase";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {SettingsService} from "../../services/settings.service";
import {OverlayContainer} from "@angular/cdk/overlay";
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../services/navigation.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  actions: Action[] = [];
  backAction = false;
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
    private readonly navigation: NavigationService) {
    this.version = environment.appVersion;
    this.authUserSubscription = this.authService.currentUser.subscribe(user => this.user = user);
    this.actionsSubscription = this.navigation.actionsChanged(actions => {
      console.log(actions);
      this.actions = actions;
    });
    this.themeModeSubscription = this.settingsService.modeChanged
      .subscribe(() => this.updateThemeMode());
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

  showSettings() {
    // this.router.navigate(['/settings'], {queryParams: {'backLink': this.router.url}}).then(() => {
    //   this.actionsService.clear();
    //   this.actionsService.showBackAction();
    //   this.actionsService.updateActions();
    // });
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
