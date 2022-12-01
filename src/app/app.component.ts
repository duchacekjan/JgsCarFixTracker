import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {environment} from "../environments/environment";
import {OverlayContainer} from "@angular/cdk/overlay";
import {SettingsService} from "./services/settings.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  actions: any[] = [];//Action[] = [];
  backAction = false;
  isLoggedIn = false;
  version: string;
  user: any;//User | null = null;
// private actionsSubscription = new Subscription();
// private backActionSubscription = new Subscription();
// private authUserSubscription = new Subscription();
// private themeModeSubscription = new Subscription();
// private queryParamsSubscription = new Subscription();

  private backLink = '/cars';

  constructor(
    // public authService: AuthService,
    // private actionsService: ActionsService,
    // private userService: UsersService,
    private settingsService: SettingsService,
    private renderer: Renderer2,
    private overlay: OverlayContainer,
    // private router: Router,
    // private route: ActivatedRoute,
    private readonly translate: TranslateService) {
    this.version = environment.appVersion;
    translate.setDefaultLang('cs');
    translate.use('cs');
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
    // this.themeModeSubscription = this.settingsService.modeChanged
    //   .subscribe(() => this.updateThemeMode());
    this.updateThemeMode();
  }

  ngOnDestroy(): void {
    // this.actionsSubscription.unsubscribe();
    // this.queryParamsSubscription.unsubscribe();
    // this.backActionSubscription.unsubscribe();
    // this.authUserSubscription.unsubscribe();
    // this.themeModeSubscription.unsubscribe();
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
